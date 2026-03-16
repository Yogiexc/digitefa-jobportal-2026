import pandas as pd
import requests
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sentence_transformers import SentenceTransformer, util
import time 
import threading
from typing import List, Optional
import pdfplumber
import re
import io
import os
from wordcloud import WordCloud
import matplotlib.pyplot as plt
from fastapi.responses import StreamingResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Configuration for wordcloud source
JOBS_SEARCH_API_URL = os.getenv("JOBS_SEARCH_API_URL", "http://127.0.0.1:3000/api/jobs-search")

# Changed model to MiniLM for faster inference and lightweight deployment
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

TOP_N_RECOMMENDATIONS = 5
MIN_SCORE_THRESHOLD = 0.3 # Lowered slightly for MiniLM since cosine sim ranges are tighter

COURSES_API_URL = os.getenv("COURSES_API_URL", "http://127.0.0.1:8888/api/courses-all")
JOB_API_URL = os.getenv("JOB_API_URL", "http://127.0.0.1:3000/api/jobs/lms")

# Cache untuk Course
courses_cache = {
    "data": None,
    "last_updated": 0,
    "ttl_seconds": 3600
}

# --- Fungsi cache existing ---
def get_all_courses_with_cache():
    global courses_cache
    now = time.time()
    if courses_cache["data"] and (now - courses_cache["last_updated"] < courses_cache["ttl_seconds"]):
        print("Menggunakan data kursus dari cache")
        return courses_cache["data"]

    print("Mengambil data kursus baru dari Laravel API...")
    try:
        response = requests.get(COURSES_API_URL, timeout=10)
        response.raise_for_status()
        data = response.json()
        if isinstance(data, dict) and 'data' in data:
            courses_cache["data"] = data['data']
        else:
            courses_cache["data"] = data
        courses_cache["last_updated"] = now
        print("Data kursus berhasil diambil dan di-cache.")
        return courses_cache["data"]
    except Exception as e:
        if courses_cache["data"]:
            print(f"Gagal mengambil data kursus baru, menggunakan cache lama: {str(e)}")
            return courses_cache["data"]
        raise HTTPException(status_code=503, detail=f"Gagal mengambil data kursus dan cache kosong: {str(e)}")

def refresh_courses_cache_background():
    """Background task untuk refresh cache kursus secara otomatis"""
    while True:
        try:
            time.sleep(3600)  # Tunggu 1 jam
            print("Background: Menyegarkan cache kursus...")
            global courses_cache
            courses_cache["last_updated"] = 0  # Force refresh
            get_all_courses_with_cache()
        except Exception as e:
            print(f"Error dalam background refresh: {str(e)}")

def ensure_courses_available():
    """Memastikan data kursus tersedia, load otomatis jika belum ada"""
    if not courses_cache["data"]:
        print("Cache kosong, memuat data kursus...")
        get_all_courses_with_cache()
    return courses_cache["data"]

@app.on_event("startup")
def load_courses_on_startup():
    print("Startup: Memuat data kursus awal...")
    try:
        get_all_courses_with_cache()
        thread = threading.Thread(target=refresh_courses_cache_background, daemon=True)
        thread.start()
        print("Background cache refresh dimulai")
    except Exception as e:
        print(f"Warning: Gagal memuat data kursus saat startup: {str(e)}")

@app.get("/health/courses-cache")
def get_courses_cache_status():
    global courses_cache
    cache_age_seconds = time.time() - courses_cache["last_updated"] if courses_cache["last_updated"] > 0 else -1
    return {
        "cache_available": courses_cache["data"] is not None,
        "total_courses": len(courses_cache["data"]) if courses_cache["data"] else 0,
        "last_updated": courses_cache["last_updated"],
        "cache_age_seconds": round(cache_age_seconds, 2),
        "cache_fresh": cache_age_seconds < courses_cache["ttl_seconds"] if cache_age_seconds >= 0 else False,
        "ttl_seconds": courses_cache["ttl_seconds"]
    }

# --- Pydantic model untuk /recommend-courses ---
class CourseRecommendationRequestBody(BaseModel):
    job_id: str

@app.post("/recommend-courses")
def recommend_courses(req: CourseRecommendationRequestBody):
    job_url = f"{JOB_API_URL}/{req.job_id}"
    try:
        job_response = requests.get(job_url, timeout=10)
        job_response.raise_for_status()
        job_data_wrapper = job_response.json()
        job_data = job_data_wrapper.get("data", {}) 
        if not job_data:
            raise HTTPException(status_code=404, detail=f"Data pekerjaan tidak ditemukan dalam respons untuk job_id: {req.job_id}")

        job_desc = job_data.get("description", "").strip()
        job_title = job_data.get("title", "Unknown Job")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal mengambil data pekerjaan: {str(e)}")

    if not job_desc:
        raise HTTPException(status_code=400, detail="Deskripsi pekerjaan kosong")

    course_data_from_cache = ensure_courses_available()
    if not course_data_from_cache:
        raise HTTPException(status_code=503, detail="Data kursus tidak tersedia.")

    df_courses = pd.DataFrame([
        {
            "id_course": c.get("id_course"),
            "title": c.get("title"),
            "description": c.get("description", "").strip()
        }
        for c in course_data_from_cache if c.get("description")
    ])

    if df_courses.empty:
        raise HTTPException(status_code=404, detail="Tidak ada kursus yang memiliki deskripsi (dari cache)")

    try:
        course_embeddings = model.encode(df_courses["description"].tolist(), convert_to_tensor=True)
        job_embedding = model.encode(job_desc, convert_to_tensor=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saat membuat embedding: {str(e)}")

    cosine_scores = util.cos_sim(job_embedding, course_embeddings)[0]
    ranked_scores = sorted(
        [(idx, float(score)) for idx, score in enumerate(cosine_scores.cpu().numpy())],
        key=lambda x: x[1], reverse=True
    )

    recommendations = []
    for idx, score in ranked_scores:
        if score < MIN_SCORE_THRESHOLD:
            continue
        course = df_courses.iloc[idx]
        recommendations.append({
            "id_course": course["id_course"],
            "title": course["title"],
            "description": course["description"],
            "similarity_score": round(score, 4)
        })
        if len(recommendations) >= TOP_N_RECOMMENDATIONS:
            break

    return {
        "job_id": req.job_id,
        "job_title": job_title,
        "job_description": job_desc,
        "recommended_courses": recommendations
    }

# --- Pydantic models untuk /calculate-candidate-suitability ---
class CompletedCourse(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

class CandidateSuitabilityRequest(BaseModel):
    job_description: str
    completed_courses: List[CompletedCourse] = Field(default_factory=list)

@app.post("/calculate-candidate-suitability")
def calculate_candidate_suitability(req: CandidateSuitabilityRequest):
    job_desc = req.job_description.strip()
    if not job_desc:
        return {"suitability_score": 0.0, "reason": "Job description is empty."}

    candidate_course_texts = []
    for course in req.completed_courses:
        if course.description and course.description.strip():
            candidate_course_texts.append(course.description.strip())

    if not candidate_course_texts:
        return {"suitability_score": 0.0, "reason": "Candidate has no completed courses with descriptions."}

    candidate_profile_text = " ".join(candidate_course_texts)

    try:
        job_embedding = model.encode(job_desc, convert_to_tensor=True)
        candidate_profile_embedding = model.encode(candidate_profile_text, convert_to_tensor=True)
    except Exception as e:
        print(f"Error creating embeddings for suitability: {str(e)}")
        return {"suitability_score": 0.0, "reason": f"Error creating embeddings: {str(e)}"}

    if job_embedding.nelement() == 0 or candidate_profile_embedding.nelement() == 0:
         return {"suitability_score": 0.0, "reason": "Could not generate valid embeddings."}

    cosine_score = util.cos_sim(job_embedding, candidate_profile_embedding)[0][0]
    suitability_score = round(float(cosine_score.cpu().numpy()), 4)

    return {"suitability_score": suitability_score}

# --- /compare-texts ---
class TextComparisonRequest(BaseModel):
    text1: str = Field(..., min_length=1, description="Teks pertama untuk dibandingkan.")
    text2: str = Field(..., min_length=1, description="Teks kedua untuk dibandingkan.")

class TextComparisonResponse(BaseModel):
    text1_provided: str
    text2_provided: str
    similarity_score: float

@app.post("/compare-texts", response_model=TextComparisonResponse)
def compare_two_texts(request: TextComparisonRequest):
    text1 = request.text1.strip()
    text2 = request.text2.strip()
    if not text1 or not text2:
        raise HTTPException(status_code=400, detail="Kedua teks tidak boleh kosong.")
    try:
        embedding1 = model.encode(text1, convert_to_tensor=True)
        embedding2 = model.encode(text2, convert_to_tensor=True)
        cosine_score = util.cos_sim(embedding1, embedding2)[0][0]
        similarity = round(float(cosine_score.cpu().numpy()), 4)
        return TextComparisonResponse(
            text1_provided=request.text1, 
            text2_provided=request.text2,
            similarity_score=similarity
        )
    except Exception as e:
        print(f"Error in /compare-texts endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan saat memproses perbandingan teks: {str(e)}")


# ---------------------------------------------------------
# NEW ENHANCEMENT ENDPOINTS 
# ---------------------------------------------------------

class MatchScoreJobData(BaseModel):
    title: str = ""
    description: str = ""
    skills_requirement: str = ""
    education_requirement: str = ""
    experience_requirement: str = ""

class MatchScoreCandidateData(BaseModel):
    skills: str = ""
    experience: str = ""
    summary: str = ""
    education: str = ""
    others: str = ""

class MatchScoreRequest(BaseModel):
    job: MatchScoreJobData
    candidate: MatchScoreCandidateData

@app.post("/calculate-match-score")
def calculate_match_score(req: MatchScoreRequest):
    """
    Calculates weighted match score based on 5 parameters:
    Skill (40%), Experience (25%), Summary (10%), Education (10%), Others (15%)
    """
    def get_sim(text1, text2):
        if not text1.strip() or not text2.strip():
            return 0.0
        try:
            emb1 = model.encode(text1, convert_to_tensor=True)
            emb2 = model.encode(text2, convert_to_tensor=True)
            score = float(util.cos_sim(emb1, emb2)[0][0].cpu().numpy())
            return max(0.0, score) # Prevent negative cosine similarity
        except:
            return 0.0

    skill_score = get_sim(req.job.skills_requirement, req.candidate.skills)
    exp_score = get_sim(req.job.experience_requirement + " " + req.job.description, req.candidate.experience)
    summary_score = get_sim(req.job.description, req.candidate.summary)
    edu_score = get_sim(req.job.education_requirement, req.candidate.education)
    others_score = get_sim(req.job.description, req.candidate.others)
    
    overall = (skill_score * 0.40) + \
              (exp_score * 0.25) + \
              (summary_score * 0.10) + \
              (edu_score * 0.10) + \
              (others_score * 0.15)

    return {
        "status": "success",
        "data": {
            "overall": round(overall, 4),
            "skills": round(skill_score, 4),
            "experience": round(exp_score, 4),
            "summary": round(summary_score, 4),
            "education": round(edu_score, 4),
            "others": round(others_score, 4)
        }
    }

class TalentProfile(BaseModel):

    id: str
    profile_text: str

class TalentSearchRequest(BaseModel):
    query: str
    talents: List[TalentProfile]

@app.post("/search-talents")
def search_talents(req: TalentSearchRequest):
    """
    Given a job requirement query and a list of talent profiles,
    ranks the talents based on semantic similarity.
    """
    if not req.query.strip() or not req.talents:
        return {"results": []}

    try:
        query_embedding = model.encode(req.query, convert_to_tensor=True)
        
        talent_texts = [t.profile_text for t in req.talents]
        talent_embeddings = model.encode(talent_texts, convert_to_tensor=True)

        cosine_scores = util.cos_sim(query_embedding, talent_embeddings)[0]
        
        results = []
        for idx, score in enumerate(cosine_scores.cpu().numpy()):
            results.append({
                "talent_id": req.talents[idx].id,
                "score": round(float(score), 4)
            })

        # Urutkan dari tertinggi ke terendah
        results = sorted(results, key=lambda x: x["score"], reverse=True)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class JobItem(BaseModel):
    id: str
    job_text: str

class JobRecommendationRequest(BaseModel):
    talent_profile_text: str
    jobs: List[JobItem]

@app.post("/recommend-jobs")
def recommend_jobs(req: JobRecommendationRequest):
    """
    Given a talent profile block and a list of job postings,
    ranks the jobs based on semantic fit for that exact talent.
    """
    if not req.talent_profile_text.strip() or not req.jobs:
        return {"results": []}

    try:
        profile_embedding = model.encode(req.talent_profile_text, convert_to_tensor=True)
        
        job_texts = [j.job_text for j in req.jobs]
        job_embeddings = model.encode(job_texts, convert_to_tensor=True)

        cosine_scores = util.cos_sim(profile_embedding, job_embeddings)[0]
        
        results = []
        for idx, score in enumerate(cosine_scores.cpu().numpy()):
            results.append({
                "job_id": req.jobs[idx].id,
                "score": round(float(score), 4)
            })

        results = sorted(results, key=lambda x: x["score"], reverse=True)
        return {"results": results[:15]} # Return top 15 recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/parse-cv")
async def parse_cv(file: UploadFile = File(...)):
    """
    Parses a PDF CV using pdfplumber and regular expressions to extract structured data.
    """
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")

    try:
        contents = await file.read()
        pdf_file = io.BytesIO(contents)
        
        full_text = ""
        with pdfplumber.open(pdf_file) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    full_text += text + "\n"
        
        # Extremely basic heuristic sectioning. 
        # For production use with a proper LLM API, you would send `full_text` to the LLM.
        lines = full_text.split('\n')
        
        sections = {
            "name": "",
            "email": "",
            "phone": "",
            "address": "",
            "date_of_birth": "",
            "personal_summary": [],
            "skills": [],
            "experience": [],
            "education": [],
            "projects": [],
            "certifications": [],
            "languages": []
        }
        
        # Regex Extractors
        email_regex = re.compile(r"([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)")
        phone_regex = re.compile(r"(\+?\d[\d -]{8,12}\d)")
        dob_regex = re.compile(r"(?i)(?:ttl|lahir|dob|date of birth)[:\s]*([0-9]{1,2}[\s\-/]+[a-zA-Z0-9]{2,10}[\s\-/]+[0-9]{2,4})")
        address_regex = re.compile(r"(?i)(?:alamat|address|domisili)[:\s]+([^=\n]{5,50})")

        # Attempt to find Email and Phone 
        emails = email_regex.findall(full_text)
        if emails:
            sections["email"] = emails[0]
            
        phones = phone_regex.findall(full_text)
        if phones:
            sections["phone"] = phones[0]
            
        dobs = dob_regex.findall(full_text)
        if dobs:
            sections["date_of_birth"] = dobs[0].strip()
            
        addresses = address_regex.findall(full_text)
        if addresses:
            sections["address"] = addresses[0].strip()

        # Use the first line as a putative name if it looks like one, ignoring empty ones
        for line in lines:
            line_clean = line.strip()
            if line_clean and len(line_clean) < 40 and "resume" not in line_clean.lower() and "cv" not in line_clean.lower():
                sections["name"] = line_clean
                break
                
        # Heuristic section finding
        current_section = None
        for line in lines:
            lline = line.lower().strip()
            
            # Identify section transitions
            if "experience" in lline or "employment" in lline or "work history" in lline or "pengalaman" in lline or "riwayat kerja" in lline:
                current_section = "experience"
                continue
            elif "education" in lline or "academic" in lline or "pendidikan" in lline or "edukasi" in lline:
                current_section = "education"
                continue
            elif "skill" in lline or "technolog" in lline or "tool" in lline or "keahlian" in lline or "kemampuan" in lline or "keterampilan" in lline:
                current_section = "skills"
                continue
            elif "summary" in lline or "profile" in lline or "about me" in lline or "profil" in lline or "tentang saya" in lline or "ringkasan" in lline:
                current_section = "personal_summary"
                continue
            elif "project" in lline or "proyek" in lline or "portfolio" in lline or "portofolio" in lline:
                current_section = "projects"
                continue
            elif "certificat" in lline or "license" in lline or "sertifikat" in lline or "lisensi" in lline or "sertifikasi" in lline:
                current_section = "certifications"
                continue
            elif "language" in lline or "bahasa" in lline:
                current_section = "languages"
                continue
                
            if current_section and lline:
                if current_section in ["skills", "languages"]:
                    # Split comma separated items
                    parts = [p.strip() for p in re.split(r'[,|•]', line) if p.strip()]
                    sections[current_section].extend(parts)
                else:
                    sections[current_section].append(line.strip())
        
        # Clean up arrays
        stop_words = ["dalam tim", "teknologi baru", "kerjasama", "komunikasi", "problem solving", "tanggung jawab"]
        phone_pattern = re.compile(r"\+?\d[\d -]{8,15}")
        
        filtered_skills = []
        for s in sections["skills"]:
            s_clean = s.strip()
            # Ignore if strictly numeric, matches phone, too short, too long, or is a stop word
            if s_clean.isdigit(): continue
            if phone_pattern.match(s_clean): continue
            if len(s_clean) < 3 or len(s_clean) > 40: continue
            if s_clean.lower() in stop_words: continue
            filtered_skills.append(s_clean)
            
        sections["skills"] = list(set(filtered_skills))
        sections["languages"] = list(set([s.strip() for s in sections["languages"] if len(s.strip()) > 1 and len(s.strip()) < 30]))
        sections["personal_summary"] = " ".join(sections["personal_summary"])
        
        # Filter projects and certs to ignore short junk lines
        valid_projects = [p for p in sections["projects"] if len(p.strip()) > 10]
        valid_certs = [c for c in sections["certifications"] if len(c.strip()) > 10]

        # Build structured fields
        sections["projects_structured"] = [{"title": "Projects", "description": " ".join(valid_projects)}] if valid_projects else []
        sections["projects"] = " ".join(valid_projects)
        sections["certifications_structured"] = [{"title": "Certifications", "description": " ".join(valid_certs)}] if valid_certs else []
        sections["certifications"] = " ".join(valid_certs)

        exp_list = []
        date_pattern = re.compile(r'\b(?:19|20)\d{2}\b|(?:Jan|Feb|Mar|Apr|May|Mei|Jun|Jul|Aug|Agu|Sep|Oct|Okt|Nov|Dec|Des)[a-z]*\s+(?:19|20)\d{2}', re.IGNORECASE)
        
        current_exp = None
        for line in sections["experience"]:
            line = line.strip()
            if not line: continue
            
            # If line contains a date, it might be a new entry
            dates = date_pattern.findall(line)
            if dates or current_exp is None:
                if current_exp:
                    exp_list.append(current_exp)
                
                # Try to separate title and company
                parts = re.split(r' at | @ | - | – ', line, 1)
                title = parts[0].strip()[:100]
                company = parts[1].strip()[:100] if len(parts) > 1 else "Extracted Company"
                
                # Cleanup date from title if it's there
                for d in dates:
                    title = title.replace(d, "").strip()
                
                current_exp = {
                    "title": title or "Experience",
                    "company": company,
                    "description": "",
                    "start_date": dates[0] if len(dates) > 0 else "",
                    "end_date": dates[1] if len(dates) > 1 else ("Present" if "present" in line.lower() or "sekarang" in line.lower() else "")
                }
            else:
                current_exp["description"] += line + " "

        if current_exp:
            exp_list.append(current_exp)
            
        sections["experience_structured"] = exp_list
        sections["experience"] = " ".join(sections["experience"][:20])

        # Handle Projects similarly
        proj_list = []
        for line in sections["projects"]:
            line = line.strip()
            if not line: continue
            if len(line) < 10: continue
            
            dates = date_pattern.findall(line)
            # Projects often don't have clear company, but let's try to extract title
            title = line[:50]
            for d in dates: title = title.replace(d, "").strip()
            
            proj_list.append({
                "title": title or "Project",
                "description": line,
                "start_date": dates[0] if len(dates) > 0 else "",
                "end_date": dates[1] if len(dates) > 1 else ""
            })
            
        sections["projects_structured"] = proj_list[:5] # Limit to top 5
        sections["projects"] = " ".join(sections["projects"][:20])

        edu_list = []
        current_edu = {"university": "Extracted University", "degree": "Degree", "major": "General", "description": ""}
        for idx, line in enumerate(sections["education"]):
            if date_pattern.search(line) and idx > 0:
                if current_edu["description"]:
                    edu_list.append(current_edu)
                current_edu = {"university": line.strip()[:50], "degree": "Degree", "major": "General", "description": line.strip() + " "}
            else:
                current_edu["description"] += line.strip() + " "
                if idx == 0 and line.strip():
                     current_edu["university"] = line.strip()[:50]
                     
        if current_edu["description"].strip():
            edu_list.append(current_edu)
            
        if not edu_list and sections["education"]:
            edu_list.append({"university": "From CV", "degree": "Auto-filled", "major": "General", "description": " ".join(sections["education"][:10])})
            
        sections["education_structured"] = edu_list
        sections["education"] = " ".join(sections["education"][:10])
        
        return {
            "parsed_data": sections,
            "raw_text": full_text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/wordcloud")
async def get_wordcloud():
    """
    Fetches all active jobs and generates a WordCloud image from their descriptions.
    """
    try:
        # Fetch jobs from the NestJS backend
        # We use a large pageSize to get a good sample of terms
        try:
            response = requests.get(f"{JOBS_SEARCH_API_URL}?pageSize=100", timeout=5)
            response.raise_for_status()
            data = response.json()
            jobs = data.get("data", [])
        except Exception as e:
            print(f"Warning: Could not fetch jobs from backend for wordcloud: {str(e)}")
            jobs = []
        
        if not jobs:
            # Fallback text if no jobs are available
            text = "No jobs available for analysis. Digitefa Job Portal."
        else:
            # Combine all job titles and descriptions (if available in the list)
            # Note: /jobs-search usually returns a summary, but let's take whatever text we have
            text_parts = []
            for job in jobs:
                title = job.get("title", "")
                location = job.get("location", "")
                cat = job.get("category", "")
                text_parts.append(f"{title} {location} {cat}")
            
            text = " ".join(text_parts)

        # Generate WordCloud
        wordcloud = WordCloud(
            width=800, 
            height=400, 
            background_color='white',
            colormap='viridis',
            max_words=100
        ).generate(text)

        # Save to buffer
        img_buffer = io.BytesIO()
        plt.figure(figsize=(10, 5))
        plt.imshow(wordcloud, interpolation='bilinear')
        plt.axis('off')
        plt.tight_layout(pad=0)
        plt.savefig(img_buffer, format='png')
        plt.close()
        
        img_buffer.seek(0)
        return StreamingResponse(img_buffer, media_type="image/png")

    except Exception as e:
        print(f"Error generating wordcloud: {str(e)}")
        # Return a placeholder image or error
        raise HTTPException(status_code=500, detail=f"Failed to generate wordcloud: {str(e)}")