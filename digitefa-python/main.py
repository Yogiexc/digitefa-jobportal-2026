import pandas as pd
import requests
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sentence_transformers import SentenceTransformer, util
import time 
import threading
from typing import List, Optional
# pyrefly: ignore [missing-import]
import pdfplumber
import re
import io
import os
from dotenv import load_dotenv

# Load environment variables early
load_dotenv()
from wordcloud import WordCloud
import matplotlib.pyplot as plt
from fastapi.responses import StreamingResponse
from contextlib import asynccontextmanager
import nltk
from nltk.corpus import stopwords
import string
from functools import lru_cache

try:
    stop_words_en = set(stopwords.words('english'))
    stop_words_id = set(stopwords.words('indonesian'))
except LookupError:
    nltk.download('stopwords')
    stop_words_en = set(stopwords.words('english'))
    stop_words_id = set(stopwords.words('indonesian'))
STOP_WORDS = stop_words_en.union(stop_words_id)

def preprocess_text(text: str) -> str:
    if not text:
        return ""
    text = text.replace("\n", ". ")
    text = text.lower().strip()
    text = text.translate(str.maketrans('', '', string.punctuation))
    text = re.sub(r'\d+', '', text)
    text = re.sub(r'\s+', ' ', text)
    words = text.split()
    filtered_words = [w for w in words if w not in STOP_WORDS]
    return ' '.join(filtered_words)

@lru_cache(maxsize=512)
def encode_text(text: str):
    preprocessed_text = preprocess_text(text)
    embedding = model.encode(preprocessed_text, convert_to_tensor=True)
    return embedding

def _remap_similarity(raw: float, raw_min: float = -0.2, raw_max: float = 1.0) -> float:
    scaled = (raw - raw_min) / (raw_max - raw_min)
    return min(max(scaled, 0.0), 1.0)

def compute_similarity_score(emb1, text2: str) -> float:
    if not text2.strip():
        return 0.0
    emb2 = encode_text(text2)
    score = util.pytorch_cos_sim(emb1, emb2).item()
    return _remap_similarity(score)

def compute_common_word_bonus(text1: str, text2: str) -> float:
    if not text1 or not text2:
        return 0.0
    words1 = set(preprocess_text(text1).split())
    words2 = set(preprocess_text(text2).split())
    common_words = words1.intersection(words2)
    bonus = len(common_words) * 0.01
    return min(bonus, 0.05)

def process_skills(skills):
    skill_text_list = []
    if isinstance(skills, list):
        for skill_item in skills:
            if isinstance(skill_item, dict) and "skill_name" in skill_item:
                skill_text_list.append(skill_item["skill_name"])
            elif isinstance(skill_item, dict) and "skill" in skill_item:
                skill_text_list.append(skill_item["skill"])
            elif isinstance(skill_item, str):
                skill_text_list.append(skill_item)
    return ". ".join(skill_text_list)

def process_education(education):
    edu_text_list = []
    if isinstance(education, list):
        for edu_item in education:
            if isinstance(edu_item, dict):
                degree = edu_item.get("degree", "")
                major = edu_item.get("major", "")
                grade = edu_item.get("grade", "")
                edu_text = f"{degree} in {major} with grade {grade}".strip()
                if edu_text:
                    edu_text_list.append(edu_text)
    return ". ".join(edu_text_list)

def process_experience(experiences):
    exp_text_list = []
    if isinstance(experiences, list):
        for exp in experiences:
            if isinstance(exp, dict):
                title = exp.get("experience_title", "")
                company = exp.get("company_name", "")
                desc = exp.get("description", "")
                exp_text = f"{title} at {company}. {desc}".strip()
                if exp_text:
                    exp_text_list.append(exp_text)
    return ". ".join(exp_text_list)

def process_project(projects):
    proj_text_list = []
    if isinstance(projects, list):
        for proj in projects:
            if isinstance(proj, dict):
                name = proj.get("project_name", "")
                desc = proj.get("description", "")
                proj_text = f"{name}. {desc}".strip()
                if proj_text:
                    proj_text_list.append(proj_text)
    return ". ".join(proj_text_list)

def process_certifications(certifications):
    cert_text_list = []
    if isinstance(certifications, list):
        for cert in certifications:
            if isinstance(cert, dict):
                name = cert.get("certificate_name", "")
                desc = cert.get("description", "")
                cert_text = f"{name}. {desc}".strip()
                if cert_text:
                    cert_text_list.append(cert_text)
    return ". ".join(cert_text_list)

def process_lms(data_lms):
    lms_text_list = []
    if isinstance(data_lms, list):
        for course in data_lms:
            if isinstance(course, dict):
                title = course.get("title", "")
                desc = course.get("description", "")
                skills = ", ".join(course.get("skills", []))
                lms_text = f"Course: {title}. Description: {desc}. Skills: {skills}".strip()
                if lms_text:
                    lms_text_list.append(lms_text)
    return ". ".join(lms_text_list)

def get_job_title_text(job: dict) -> str:
    return job.get("title", "")

def get_job_details_text(job: dict) -> str:
    desc = job.get("description", "")
    req_skills = process_skills(job.get("skills_requirement", []))
    edu = job.get("education_requirement", "")
    exp = job.get("experience_requirement", "")
    return f"{desc} {req_skills} {edu} {exp}".strip()



@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Startup: Memuat data kursus awal...")
    try:
        get_all_courses_with_cache()
        thread = threading.Thread(target=refresh_courses_cache_background, daemon=True)
        thread.start()
        print("Startup berhasil: Background refresh berjalan.")
    except Exception as e:
        print(f"Error saat startup: {e}")
    yield

app = FastAPI(
    title="Digitefa AI API",
    description="API for AI-based features like CV Parsing, Job Matching, Course Recommendation, and Talent Search.",
    version="1.0.0",
    lifespan=lifespan
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

# --- PILIH SALAH SATU MODEL AI DI BAWAH INI (COMMENT / UNCOMMENT) ---

# Opsi 1: MiniLM (Super Ringan & Cepat, Tapi Global/Inggris) -> Default
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

# Model multilingual untuk mendukung teks Bahasa Indonesia & Inggris
# model = SentenceTransformer('intfloat/multilingual-e5-small')

# --------------------------------------------------------------------

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
    Mirror rumus talent match legacy dari branch file-asli-banget,
    tetapi tetap memakai kontrak HTTP yang dipakai branch ael-bagas.
    """
    def _remap_similarity(raw: float, raw_min=-0.2, raw_max=1.0) -> float:
        scaled = (raw - raw_min) / (raw_max - raw_min)
        return min(max(scaled, 0.0), 1.0)

    def get_sim(text1, text2):
        if not text1.strip() or not text2.strip():
            return 0.0
        try:
            emb1 = model.encode(text1, convert_to_tensor=True)
            emb2 = model.encode(text2, convert_to_tensor=True)
            score = float(util.cos_sim(emb1, emb2)[0][0].cpu().numpy())
            return _remap_similarity(score)
        except:
            return 0.0

    def compute_common_word_bonus(text1: str, text2: str) -> float:
        if not text1 or not text2:
            return 0.0
        segments1 = [seg.strip() for seg in text1.split('.') if seg.strip()]
        total_bonus = 0.0
        for seg1 in segments1:
            score = get_sim(seg1, text2)
            if score >= 0.5:
                bonus = (score - 0.5) * 0.6
                total_bonus += bonus
        return min(total_bonus, 0.3)

    summary_str = req.candidate.summary
    skills_str = req.candidate.skills
    education_str = req.candidate.education
    experience_str = req.candidate.experience
    others_str = req.candidate.others

    user_details_text = ". ".join(
        text for text in [
            summary_str,
            education_str,
            experience_str,
            others_str,
            skills_str,
        ] if text
    ).strip()

    if not user_details_text:
        return {
            "status": "success",
            "data": {
                "overall": 0.0,
                "summary": 0.0,
                "skills": 0.0,
                "education": 0.0,
                "experience": 0.0,
                "projects": 0.0,
                "certifications": 0.0,
            }
        }

    job_skills_str = req.job.skills_requirement
    job_title_text = req.job.title
    job_details_text = f"{req.job.description} {job_skills_str} {req.job.education_requirement} {req.job.experience_requirement}".strip()
    
    title_similarity = get_sim(user_details_text, job_title_text)
    detail_similarity = get_sim(user_details_text, job_details_text)
    bonus = compute_common_word_bonus(skills_str, job_title_text)
    
    overall = (0.3 * title_similarity) + (0.7 * detail_similarity) + bonus
    overall = min(max(overall, 0.0), 1.0)

    summary_score = get_sim(summary_str, job_details_text)
    skills_score = get_sim(skills_str, job_details_text)
    education_score = get_sim(education_str, job_details_text)
    experience_score = get_sim(experience_str, job_details_text)
    projects_score = get_sim(others_str, job_details_text)
    certifications_score = 0.0

    return {
        "status": "success",
        "data": {
            "overall": round(overall, 4),
            "summary": round(summary_score, 4),
            "skills": round(skills_score, 4),
            "education": round(education_score, 4),
            "experience": round(experience_score, 4),
            "projects": round(projects_score, 4),
            "certifications": round(certifications_score, 4),
        }
    }

class JobRecommendationRequest(BaseModel):
    talent: dict
    jobs: list
    data_lms: Optional[list] = []
    sort_fields: Optional[List[str]] = None
    is_sort: Optional[str] = "false"
    is_filter: Optional[str] = "false"

@app.post("/recommend-jobs")
def recommend_jobs(req: JobRecommendationRequest):
    try:
        title_weight = 0.3
        detail_weight = 0.7
        minimum_similarity = 0.44 if req.is_filter == "true" else 0.0
        
        user = req.talent
        jobs = req.jobs
        data_lms = req.data_lms
        
        personal_summary = user.get("personal_summary", "")
        skills_text = process_skills(user.get("skills", []))
        education_text = process_education(user.get("education", []))
        experience_text = process_experience(user.get("experiences", []))
        projects_text = process_project(user.get("projects", []))
        certifications_text = process_certifications(user.get("certifications", []))
        lms_text = process_lms(data_lms)

        component_texts = {
            "personal_summary": personal_summary,
            "skills": skills_text,
            "education": education_text,
            "experience": experience_text,
            "projects": projects_text,
            "certifications": certifications_text,
            "lms": lms_text
        }

        if req.sort_fields and req.is_sort == "true":
            selected_texts = [
                component_texts[f] for f in req.sort_fields
                if component_texts.get(f)
            ]
            if not selected_texts:
                return {"results": []}
            user_details_text = " ".join(selected_texts)
        else:
            user_details_text = " ".join([t for t in component_texts.values() if t])
            
        if not user_details_text:
            return {"results": []}
            
        user_embedding = encode_text(user_details_text)
        results = []
        combined_text_for_bonus = skills_text
        
        for job in jobs:
            job_title_text = get_job_title_text(job)
            job_details_text = get_job_details_text(job)
            job_details_embedding = encode_text(job_details_text)
                        
            title_similarity = compute_similarity_score(user_embedding, job_title_text)
            detail_similarity = util.pytorch_cos_sim(user_embedding, job_details_embedding).item()
            bonus = compute_common_word_bonus(combined_text_for_bonus, job_title_text)
            final_similarity = round((title_weight * title_similarity) + (detail_weight * detail_similarity) + bonus, 4)
            
            component_matches = {}
            for key, text in component_texts.items():
                match_key = f"{key}_match"
                if text:
                    emb = encode_text(text)
                    sim = util.pytorch_cos_sim(emb, job_details_embedding).item()
                    sim = _remap_similarity(sim)
                    component_matches[match_key] = round(sim * 100, 2)
                else:
                    component_matches[match_key] = 0.0
            
            job_result = {
                "job_id": job.get("job_id") or job.get("id"),
                "title": job.get("title", ""),
                "similarity_score": final_similarity,
                "bonus": bonus,
                "match_details": component_matches
            }
            results.append(job_result)
            
        filtered_jobs = [job for job in results if job.get("similarity_score", 0) >= minimum_similarity]
        sorted_jobs = sorted(filtered_jobs, key=lambda x: x["similarity_score"], reverse=True)
        return {"results": sorted_jobs}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

class TalentSearchRequest(BaseModel):
    job: dict
    talents: list
    data_lms: Optional[list] = []
    sort_fields: Optional[List[str]] = None
    is_sort: Optional[str] = "false"
    is_filter: Optional[str] = "false"

@app.post("/search-talents")
def search_talents(req: TalentSearchRequest):
    try:
        title_weight = 0.3
        detail_weight = 0.7
        minimum_similarity = 0.44 if req.is_filter == "true" else 0.0
        
        job = req.job
        talents = req.talents
        data_lms = req.data_lms
        
        job_title_text = get_job_title_text(job)
        job_details_text = get_job_details_text(job)
        job_embedding = encode_text(job_details_text)
        
        results = []
        for talent in talents:
            talent_id = talent.get("job_seeker_detail_id") or talent.get("job_seeker_id") or talent.get("id")
            personal_summary = talent.get("personal_summary", "")
            skills_text = process_skills(talent.get("skills", []))
            education_text = process_education(talent.get("education", []))
            experience_text = process_experience(talent.get("experiences", []))
            projects_text = process_project(talent.get("projects", []))
            certifications_text = process_certifications(talent.get("certifications", []))
            lms_text = process_lms(data_lms)

            component_texts = {
                "personal_summary": personal_summary,
                "skills": skills_text,
                "education": education_text,
                "experience": experience_text,
                "projects": projects_text,
                "certifications": certifications_text,
                "lms": lms_text
            }
            
            if req.sort_fields and req.is_sort == "true":
                selected_texts = [
                    component_texts[f] for f in req.sort_fields
                    if component_texts.get(f)
                ]
                if not selected_texts:
                    continue
                user_details_text = " ".join(selected_texts)
            else:
                user_details_text = " ".join([t for t in component_texts.values() if t])
                
            if not user_details_text:
                continue
                
            user_embedding = encode_text(user_details_text)
            
            title_similarity = compute_similarity_score(user_embedding, job_title_text)
            detail_similarity = util.pytorch_cos_sim(user_embedding, job_embedding).item()
            bonus = compute_common_word_bonus(skills_text, job_title_text)
            final_similarity = round((title_weight * title_similarity) + (detail_weight * detail_similarity) + bonus, 4)
            
            component_matches = {}
            for key, text in component_texts.items():
                match_key = f"{key}_match"
                if text:
                    emb = encode_text(text)
                    sim = util.pytorch_cos_sim(emb, job_embedding).item()
                    sim = _remap_similarity(sim)
                    component_matches[match_key] = round(sim * 100, 2)
                else:
                    component_matches[match_key] = 0.0
            
            talent_result = {
                "job_seeker_id": talent_id,
                "full_name": talent.get("full_name", ""),
                "similarity_score": final_similarity,
                "bonus": bonus,
                "match_details": component_matches
            }
            results.append(talent_result)
            
        filtered_talents = [t for t in results if t.get("similarity_score", 0) >= minimum_similarity]
        sorted_talents = sorted(filtered_talents, key=lambda x: x["similarity_score"], reverse=True)
        return {"results": sorted_talents}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/parse-cv")
async def parse_cv(file: UploadFile = File(...)):
    """
    ENDPOINT INI BERFUNGSI SEBAGAI OTAK UTAMA FITUR AUTOFILL CV.
    Alur Kerja:
    1. Menerima file PDF dari backend (NestJS).
    2. Membaca teks mentah dari PDF menggunakan library pdfplumber.
    3. Mengekstrak informasi penting (Nama, Email, HP, Pengalaman, dll) menggunakan Regex (Pola Teks).
    4. Mengembalikan data terstruktur dalam bentuk JSON kembali ke NestJS.
    """
    if not file.filename or not file.filename.lower().endswith('.pdf'):
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

        # Use NVIDIA NIM API (Qwen3) for JSON Extraction
        import json
        from dotenv import load_dotenv
        load_dotenv()
        
        prompt = f"""
You are an expert HR CV parser. Extract information from the following CV text.
Return ONLY a valid JSON object matching the following structure exactly. Do not add markdown blocks like ```json or anything else. Just the raw JSON.

{{
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "date_of_birth": "string",
    "personal_summary": "string",
    "skills": ["string", "string"],
    "languages": ["string", "string"],
    "experience_structured": [
        {{
            "title": "string",
            "company": "string",
            "employment_type": "string",
            "location": "string",
            "start_date": "string",
            "end_date": "string",
            "description": "string"
        }}
    ],
    "education_structured": [
        {{
            "university": "string",
            "major": "string",
            "degree": "string",
            "start_date": "string",
            "end_date": "string",
            "grade": "string"
        }}
    ],
    "projects_structured": [
        {{
            "title": "string",
            "description": "string",
            "start_date": "string",
            "end_date": "string"
        }}
    ],
    "certifications_structured": [
        {{
            "certification_name": "string",
            "issuing_organization": "string",
            "issue_date": "string",
            "expiration_date": "string",
            "credential_url": "string"
        }}
    ]
}}

CV Text:
{full_text}
"""

        api_key = os.environ.get("NVIDIA_API_KEY", "")
        if not api_key:
            raise HTTPException(status_code=500, detail="NVIDIA_API_KEY is not configured in .env")

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "qwen/qwen3-next-80b-a3b-instruct",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.2,
            "top_p": 0.7,
            "max_tokens": 2048,
        }
        
        # Increased timeout to 120s to allow NVIDIA supercomputer sufficient time to parse large CV texts
        response = requests.post("https://integrate.api.nvidia.com/v1/chat/completions", headers=headers, json=payload, timeout=120)
        response.raise_for_status()
        
        result_json = response.json()
        ai_response = result_json["choices"][0]["message"]["content"]
        
        # Strip markdown if present
        if ai_response.startswith("```json"):
            ai_response = ai_response[7:-3]
        elif ai_response.startswith("```"):
            ai_response = ai_response[3:-3]
            
        ai_response = ai_response.strip()
        
        try:
            sections = json.loads(ai_response)
        except json.JSONDecodeError:
            print("Failed to decode JSON from AI:", ai_response)
            raise HTTPException(status_code=500, detail="AI failed to return valid JSON.")
            
        # Ensure fallback lists
        for key in ["skills", "languages", "experience_structured", "education_structured", "projects_structured", "certifications_structured"]:
            if key not in sections or sections[key] is None:
                sections[key] = []
        
        # Calculate unread_sections
        unread_sections = []
        if not sections.get("name"): unread_sections.append("Name")
        if not sections.get("email"): unread_sections.append("Email")
        if not sections.get("phone"): unread_sections.append("Phone Number")
        if not sections.get("address"): unread_sections.append("Address")
        if not sections.get("date_of_birth"): unread_sections.append("Date of Birth")
        if not sections.get("personal_summary"): unread_sections.append("Personal Summary")
        if not sections.get("skills"): unread_sections.append("Skills")
        if not sections.get("languages"): unread_sections.append("Languages")
        if not sections.get("experience_structured"): unread_sections.append("Experience")
        if not sections.get("education_structured"): unread_sections.append("Education")
        if not sections.get("projects_structured"): unread_sections.append("Projects")
        if not sections.get("certifications_structured"): unread_sections.append("Certifications")
        
        # Some fallback dummy fields expected by the UI
        sections["experience"] = [e.get("title", "") for e in sections.get("experience_structured", []) if isinstance(e, dict)]
        sections["education"] = [e.get("university", "") for e in sections.get("education_structured", []) if isinstance(e, dict)]
        sections["certifications"] = [e.get("certification_name", "") for e in sections.get("certifications_structured", []) if isinstance(e, dict)]
        sections["projects"] = [e.get("title", "") for e in sections.get("projects_structured", []) if isinstance(e, dict)]

        return {
            "parsed_data": {
                **sections,
                "full_name": sections.get("name", ""),
                "unread_sections": list(set(unread_sections))
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