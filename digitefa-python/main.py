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
app = FastAPI(
    title="Digitefa AI API",
    description="API for AI-based features like CV Parsing, Job Matching, Course Recommendation, and Talent Search.",
    version="1.0.0"
)
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
    ENDPOINT INI MENGHITUNG KECOCOKAN (MATCH SCORE) ANTARA KANDIDAT & LOWONGAN.
    Ini BUKAN sekadar pencocokan kata (word matching) biasa!
    Ini menggunakan AI model (all-MiniLM-L6-v2) untuk mencocokkan "MAKNA" kalimat (Semantic Embedding).
    
    Hitungan Bobot:
    - Skill (40%), Experience (25%), Summary (10%), Education (10%), Others (15%)
    """
    def get_sim(text1, text2):
        if not text1.strip() or not text2.strip():
            return 0.0
        try:
            # 1. AI MENGUBAH TEKS MENJADI ANGKA (VECTOR)
            emb1 = model.encode(text1, convert_to_tensor=True)
            emb2 = model.encode(text2, convert_to_tensor=True)
            
            # 2. MENGHITUNG KEMIRIPAN SUDUT ANGKA (Cosine Similarity)
            # Semakin dekat maknanya, semakin mendekati angka 1.0 (100% Cocok)
            score = float(util.cos_sim(emb1, emb2)[0][0].cpu().numpy())
            return max(0.0, score) # Hindari nilai minus

        except:
            return 0.0

    # 3. MENGHITUNG NILAI KECOCOKAN TIAP KATEGORI (0.0 sampai 1.0)
    skill_score = get_sim(req.job.skills_requirement, req.candidate.skills)
    exp_score = get_sim(req.job.experience_requirement + " " + req.job.description, req.candidate.experience)
    summary_score = get_sim(req.job.description, req.candidate.summary)
    edu_score = get_sim(req.job.education_requirement, req.candidate.education)
    others_score = get_sim(req.job.description, req.candidate.others)
    
    # 4. MENGGABUNGKAN SELURUH HASIL MENJADI PERSENTASE TOTAL (OVERALL)
    overall = (skill_score * 0.40) + \
              (exp_score * 0.25) + \
              (summary_score * 0.10) + \
              (edu_score * 0.10) + \
              (others_score * 0.15)

    # 5. KEMBALIKAN KE NESTJS CMS COMPANY
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
    ENDPOINT INI BERFUNGSI SEBAGAI OTAR UTAMA FITUR AUTOFILL CV.
    Alur Kerja:
    1. Menerima file PDF dari backend (NestJS).
    2. Membaca teks mentah dari PDF menggunakan library pdfplumber.
    3. Mengekstrak informasi penting (Nama, Email, HP, Pengalaman, dll) menggunakan Regex (Pola Teks).
    4. Mengembalikan data terstruktur dalam bentuk JSON kembali ke NestJS.
    """
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")

    try:
        # 1. BACA FILE KE DALAM MEMORI (RAM)
        contents = await file.read()
        pdf_file = io.BytesIO(contents)
        
        # 2. EKSTRAKSI TEKS DARI PDF
        full_text = ""
        with pdfplumber.open(pdf_file) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    full_text += text + "\n"
                    
        cv_lines = full_text.split('\n')
        
        sections = {
            "name": "", "email": "", "phone": "", "address": "", "date_of_birth": "",
            "personal_summary": [], "skills": [], "experience": [], 
            "education": [], "projects": [], "certifications": [], "languages": []
        }
        
        email_regex = re.compile(r"([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)")
        phone_regex = re.compile(r"(\+?\d[\d -]{8,15})")
        dob_regex = re.compile(r"(?i)(?:ttl|lahir|dob|date of birth)[:\s]*(\d{1,2}[\s\-/]+[a-zA-Z0-9]{2,10}[\s\-/]+\d{2,4})")
        address_regex = re.compile(r"(?i)(?:alamat|address|domisili)[:\s]+([^=\n]{5,50})")
        
        emails = email_regex.findall(full_text)
        if emails: sections["email"] = emails[0]
            
        phones = phone_regex.findall(full_text)
        if phones: sections["phone"] = phones[0]
            
        dobs = dob_regex.findall(full_text)
        if dobs: sections["date_of_birth"] = dobs[0].strip()
            
        addresses = address_regex.findall(full_text)
        if addresses: sections["address"] = addresses[0].strip()

        for line in cv_lines[:10]:  # cuma cek 10 baris atas
            line_clean = line.strip()

            if not line_clean:
                continue

            # ngeclean simbol aneh
            if re.search(r'\d', line_clean):
                continue

            # skip kalau keyword bukan nama
            if any(k in line_clean.lower() for k in [
                "cv", "resume", "profile", "profil",
                "experience", "education", "skills"
                ]):
                continue

            # kandidat nama: 2–4 kata, huruf semua
            words = line_clean.split()
            if 2 <= len(words) <= 4:
                sections["name"] = line_clean
            break
                    
        current_section = None
        header_patterns = {
            "experience": r"^(experiences?|pengalaman|work history|employment|riwayat kerja)$",
            "education": r"^(pendidikan|education|academic|riwayat pendidikan)",
            "skills": r"^(keahlian|skills|keterampilan|kemampuan|core competencies)",
           "personal_summary": r"^(summary|profile|profil|personal summary|tentang saya|about me|ringkasan)",
            "projects": r"^(projects|proyek|portfolio|portofolio)",
            "certifications": r"(certif|license)",
            "languages": r"^(languages|bahasa)"
        }
        
        for line in cv_lines:
            lline = line.lower().strip()

            # DETECT HEADER BARU
            new_section = None
            for sec, pattern in header_patterns.items():
                if re.search(pattern, lline):
                    new_section = sec
                    break

            if new_section:
                current_section = new_section
                continue  

            # MASUKKAN DATA
            if current_section and line.strip():
                if current_section in ["skills", "languages"]:
                    parts = [p.strip() for p in re.split(r'[,|•;*\n]', line) if p.strip()]
                    sections[current_section].extend(parts)
                else:
                    sections[current_section].append(line.strip())
        # Skill Cleanup
        filtered_skills = []
        for s in sections["skills"]:
            s_clean = s.strip('-• ')
            if len(s_clean) < 2 or len(s_clean) > 40: continue
            if phone_regex.match(s_clean): continue
            filtered_skills.append(s_clean)
        sections["skills"] = list(set(filtered_skills))
        
        # Languages Cleanup
        sections["languages"] = list(set([s.strip('-• ') for s in sections["languages"] if 1 < len(s.strip()) < 30]))
        
        # Summary
        sections["personal_summary"] = [
            line for line in sections["personal_summary"]
            if len(line.strip()) > 5
        ]

        sections["personal_summary"] = re.sub(
            r'\s+',
            ' ',
            " ".join(sections["personal_summary"])
        ).strip()

        # Projects
        projects = []
        current_proj = None

        date_regex = re.compile(r'(?i)([a-z]+\s+\d{4})\s*[–-]\s*([a-z]+\s+\d{4})')

        for line in sections["projects"]:
            line = line.strip('-• ').strip()
            if not line:
                continue

            # 1. DATE
            date_match = date_regex.search(line)
            if date_match:
                if current_proj:
                    current_proj["start_date"] = date_match.group(1)
                    current_proj["end_date"] = date_match.group(2)
                continue

            # 2. TITLE → HANYA kalau BELUM ADA project
            if current_proj is None:
                current_proj = {
                    "title": line,
                    "description": "",
                    "start_date": "",
                    "end_date": ""
                }
                continue

            # 3. DETECT PROJECT BARU (STRONG SIGNAL)
            if (
                current_proj["description"]
                and len(current_proj["description"]) > 50
                and line.istitle()
            ):
                projects.append(current_proj)
                current_proj = {
                    "title": line,
                    "description": "",
                    "start_date": "",
                    "end_date": ""
                }
                continue

            # 4. DESCRIPTION (DEFAULT)
            current_proj["description"] += line + " "

        # simpan terakhir
        if current_proj:
            projects.append(current_proj)

        sections["projects_structured"] = projects
        
        # Certifications
        raw_lines = sections.get("certifications", [])

        # pastikan list
        if isinstance(raw_lines, str):
            raw_lines = [raw_lines]

        # gabung semua jadi 1 string
        text = " ".join(raw_lines)

        # normalize bulan
        def normalize_month(text):
            months = {
                "januari": "January", "februari": "February", "maret": "March",
                "april": "April", "mei": "May", "juni": "June",
                "juli": "July", "agustus": "August", "september": "September",
                "oktober": "October", "november": "November", "desember": "December"
            }
            for indo, eng in months.items():
                text = re.sub(indo, eng, text, flags=re.IGNORECASE)
            return text

        text = normalize_month(text)

        # normalize dash
        text = text.replace("–", "-").replace("—", "-")

        # regex ambil semua field
        pattern = r'(.+?)\s*-\s*(.+?)\s+([A-Za-z]+\s+\d{4})\s*-\s*([A-Za-z]+\s+\d{4})\s+(https?://\S+|www\.\S+)'

        matches = re.findall(pattern, text)

        cert_list = []

        for m in matches:
            cert = {
                "certification_name": m[0].strip(),
                "issuing_organization": m[1].strip(),
                "issue_date": m[2].strip(),
                "expiration_date": m[3].strip(),
                "credential_url": m[4].rstrip('.,);')
            }
            cert_list.append(cert)

        sections["certifications_structured"] = cert_list
        

        # Experience
        print("RAW EXPERIENCE LINES:")
        for l in sections["experience"]:
            print(">>", repr(l))
        exp_list = []
        current_exp = None
        prev_line = ""

        date_regex = re.compile(r'(?i)[a-z]+\s+\d{4}\s*[–-]\s*[a-z]+\s+\d{4}')

        for line in sections["experience"]:
            line = line.strip()
            if not line:
                continue

            # skip header
            if line.lower() in ["experience", "experiences", "pengalaman"]:
                continue

            # DETECT DATE 
            if date_regex.search(line):
                dates = re.findall(r'(?i)[a-z]+\s+\d{4}', line)

                # simpan sebelumnya
                if current_exp:
                    exp_list.append(current_exp)

                current_exp = {
                    "title": prev_line,  
                    "company": "",
                    "employment_type": "",
                    "location_type": "",
                    "location": "",
                    "description": "",
                    "start_date": dates[0] if len(dates) > 0 else "",
                    "end_date": dates[1] if len(dates) > 1 else ""
                }

                prev_line = line
                continue

            # kalau belum mulai record → cuma simpan prev_line
            if current_exp is None:
                prev_line = line
                continue

            # COMPANY
            if not current_exp["company"]:
                current_exp["company"] = line
                prev_line = line
                continue

            # EMPLOYMENT TYPE
            if line.lower() in ["full time", "full-time", "part time", "internship", "freelance"]:
                current_exp["employment_type"] = line
                prev_line = line
                continue

            # LOCATION TYPE
            if line.lower() in ["remote", "on-site", "onsite", "hybrid"]:
                current_exp["location_type"] = line
                prev_line = line
                continue

            # LOCATION
            if not current_exp["location"]:
                current_exp["location"] = line
                prev_line = line
                continue

            # DESCRIPTION
            current_exp["description"] += line + " "
            prev_line = line

        # simpan terakhir
        if current_exp:
            exp_list.append(current_exp)

        sections["experience_structured"] = exp_list
        sections["experience"] = " ".join(sections["experience"][:20])

        edu = {
            "university": "",
            "degree": "",
            "major": "",
            "grade": "",
            "start_date": "",
            "end_date": "",
            "length_of_study": ""
        }

        for line in sections["education"]:
            line = line.strip()
            if not line:
                continue

            # UNIVERSITY
            if "university" in line.lower() or "universitas" in line.lower():
                edu["university"] = line

            # DATE
            elif re.search(r'(?i)[a-z]+\s+\d{4}\s*-\s*[a-z]+\s+\d{4}', line):
                dates = re.findall(r'(?i)[a-z]+\s+\d{4}', line)
                if len(dates) >= 2:
                    edu["start_date"] = dates[0]
                    edu["end_date"] = dates[1]

            # DEGREE
            elif re.search(r'(?i)degree|sarjana|diploma|associate|bachelor|master', line):
                edu["degree"] = line

            # GPA
            elif re.search(r'(?i)(gpa|ipk)?[:\s]*\b\d[.,]\d{1,2}\b', line):
                gpa_match = re.search(r'\b\d[.,]\d{1,2}\b', line)
                if gpa_match:
                    edu["grade"] = gpa_match.group(0).replace(",", ".")

            # MAJOR
            else:
                edu["major"] = line

        # LENGTH
        if edu["start_date"] and edu["end_date"]:
            try:
                start_year = re.search(r'\d{4}', edu["start_date"]).group()
                end_year = re.search(r'\d{4}', edu["end_date"]).group()
                edu["length_of_study"] = f"{int(end_year) - int(start_year)} years"
            except:
                pass

        sections["education_structured"] = [edu]
        sections["education"] = " ".join(sections["education"][:10])
        
        sections["full_name"] = sections["name"]
        return {
            "parsed_data": {
                **sections,
                "full_name": sections["name"]
            },
            "raw_text": full_text
        }
    except Exception as e:
        print("Error Parsing CV:", str(e))
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