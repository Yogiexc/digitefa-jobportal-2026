# benchmark.py
import json
import time
import re
import string
import nltk
from sentence_transformers import SentenceTransformer, util

print("Memulai script benchmark model SentenceTransformer...")
print("-" * 60)

# --- 1. Unduh Stopwords untuk Preprocessing ---
try:
    from nltk.corpus import stopwords
    stop_words_en = set(stopwords.words('english'))
    stop_words_id = set(stopwords.words('indonesian'))
except Exception:
    print("Mengunduh library stopwords NLTK...")
    nltk.download('stopwords', quiet=True)
    from nltk.corpus import stopwords
    stop_words_en = set(stopwords.words('english'))
    stop_words_id = set(stopwords.words('indonesian'))

STOP_WORDS = stop_words_en.union(stop_words_id)

# --- 2. Logika Preprocessing & Ekstraksi Teks (100% Sesuai main.py) ---
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

# --- FUNGSI EKSTRAKSI TEKS LOWONGAN (Sesuai main.py) ---
def get_job_title_text(job: dict) -> str:
    return job.get("title", "")

def get_job_details_text(job: dict) -> str:
    desc = job.get("description", "")
    req_skills = process_skills(job.get("skills_requirement", []))
    edu = job.get("education_requirement", "")
    exp = job.get("experience_requirement", "")
    return f"{desc} {req_skills} {edu} {exp}".strip()

# --- 3. Rumus Scoring Asli (Sesuai main.py) ---
def _remap_similarity(raw: float, raw_min: float = -0.2, raw_max: float = 1.0) -> float:
    scaled = (raw - raw_min) / (raw_max - raw_min)
    return min(max(scaled, 0.0), 1.0)

def compute_common_word_bonus(text1: str, text2: str) -> float:
    if not text1 or not text2:
        return 0.0
    words1 = set(preprocess_text(text1).split())
    words2 = set(preprocess_text(text2).split())
    common_words = words1.intersection(words2)
    bonus = len(common_words) * 0.01
    return min(bonus, 0.05)

# --- 4. Definisikan Model ---
model_configs = {
    "MiniLM (Baseline)": "all-MiniLM-L6-v2",
    "MPNet (Akurasi Tinggi)": "all-mpnet-base-v2",
    "Multilingual MPNet": "paraphrase-multilingual-mpnet-base-v2",
    "IndoBERT (SBERT-Indo)": "firqaaa/indo-sentence-bert-base"
}

loaded_models = {}
print("Menginisialisasi model-model...")
for key, model_name in model_configs.items():
    print(f"  Loading {key} ({model_name})...")
    start_time = time.time()
    try:
        loaded_models[key] = SentenceTransformer(model_name)
        print(f"  {key} Loaded dalam {time.time() - start_time:.2f} detik.")
    except Exception as e:
        print(f"  Gagal memuat {key}: {e}")
        exit()

print("-" * 60)

# --- 5. Load Data Uji ---
try:
    with open("samples.json", "r", encoding="utf-8") as f:
        data_samples = json.load(f)
    jobs = data_samples["jobs"]
    talents = data_samples["talents"]
    print(f"Loaded {len(jobs)} Lowongan & {len(talents)} Talent dari database.")
except Exception as e:
    print(f"Gagal membaca samples.json: {e}")
    exit()

# --- 6. Proses Perbandingan dengan Rumus Asli ---
results = []

for j in jobs:
    # Menggunakan fungsi ekstraksi bawaan main.py
    job_title_text = get_job_title_text(j)
    job_id = j.get("job_id", "")
    short_id = job_id[:6] if job_id else ""
    job_display_name = f"{job_title_text} ({short_id})" if short_id else job_title_text
    job_details_text = get_job_details_text(j)
    
    print(f"\nMemproses Lowongan: {job_display_name}")
    print(f"  > Detail Lowongan (panjang karakter: {len(job_details_text)})")
    
    for t in talents:
        talent_name = t.get("full_name", "Unknown")
        
        # Proses seluruh bagian profile seperti di backend produksi
        personal_summary = t.get("personal_summary", "")
        skills_text = process_skills(t.get("skills", []))
        education_text = process_education(t.get("education", []))
        experience_text = process_experience(t.get("experiences", []))
        projects_text = process_project(t.get("projects", []))
        certifications_text = process_certifications(t.get("certifications", []))
        
        # Gabung semua teks talent
        component_texts = [
            personal_summary, skills_text, education_text, 
            experience_text, projects_text, certifications_text
        ]
        user_details_text = " ".join([txt for txt in component_texts if txt])
        
        if not user_details_text:
            continue
            
        row = {"job": job_display_name, "talent": talent_name}
        
        # Hitung skor untuk tiap model
        for model_key, model_obj in loaded_models.items():
            # 1. Encode Teks
            job_title_emb = model_obj.encode(job_title_text, convert_to_tensor=True)
            job_details_emb = model_obj.encode(job_details_text, convert_to_tensor=True)
            user_emb = model_obj.encode(user_details_text, convert_to_tensor=True)
            
            # 2. Hitung Similarity (Perhatikan remapping hanya untuk Title Similarity)
            raw_title_sim = util.pytorch_cos_sim(user_emb, job_title_emb).item()
            title_similarity = _remap_similarity(raw_title_sim)
            
            detail_similarity = util.pytorch_cos_sim(user_emb, job_details_emb).item()
            
            # 3. Hitung Bonus Kata Kunci (Skills vs Job Title)
            bonus = compute_common_word_bonus(skills_text, job_title_text)
            
            # 4. Final Score (Bobot 30% Judul + 70% Detail + Bonus)
            final_score = (0.3 * title_similarity) + (0.7 * detail_similarity) + bonus
            row[model_key] = round(final_score, 4)
            
        results.append(row)

# --- Sortir Hasil dari Tertinggi ke Terendah (berdasarkan Rata-rata Skor Model) ---
def get_average_score(r):
    # Mengambil nilai skor dari keempat model dan mencari rata-ratanya
    scores = [
        r.get('MiniLM (Baseline)', 0), 
        r.get('MPNet (Akurasi Tinggi)', 0), 
        r.get('Multilingual MPNet', 0), 
        r.get('IndoBERT (SBERT-Indo)', 0)
    ]
    return sum(scores) / len(scores)

results = sorted(results, key=get_average_score, reverse=True)

# --- 7. Tampilkan Hasil Akhir ---
print("\n" + "="*125)
print("                                      TABEL PERBANDINGAN SKOR TALENT MATCHES                                    ")
print("="*125)
print(f"{'Job Title (ID)':<30} | {'Talent (Asli)':<20} | {'MiniLM':<12} | {'MPNet':<12} | {'Multilingual':<15} | {'IndoBERT'}")
print("-" * 125)
for r in results:
    short_title = r['job'][:28] + ".." if len(r['job']) > 30 else r['job']
    short_talent = r['talent'][:18] + ".." if len(r['talent']) > 20 else r['talent']
    print(f"{short_title:<30} | {short_talent:<20} | {r['MiniLM (Baseline)']:<12} | {r['MPNet (Akurasi Tinggi)']:<12} | {r['Multilingual MPNet']:<15} | {r['IndoBERT (SBERT-Indo)']}")
print("="*125)