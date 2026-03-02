import zmq
import re
import time
import psutil
import functools
from sentence_transformers import SentenceTransformer, util
from loguru import logger
import platform
if platform.system() != "Windows":
    import resource
from autocorrect import Speller
import json
import string
from nltk.corpus import stopwords
import nltk
from functools import lru_cache

def benchmark(func):
    """
    Decorator untuk mengukur waktu eksekusi dan penggunaan memori suatu fungsi.
    Menggunakan psutil untuk memantau memory info dan time.perf_counter untuk waktu.
    """
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        process = psutil.Process()  # Objek proses saat ini
        # === Metrik Awal ===
        start_time = time.perf_counter()
        start_mem = process.memory_info().rss  # Resident Set Size (dalam bytes)
        # Inisialisasi CPU times (untuk perhitungan individual, bukan persen)
        start_cpu = process.cpu_times()
        # I/O counters (jika didukung)
        try:
            start_io = process.io_counters()
        except AttributeError:
            start_io = None
        # Context switches: voluntary dan involuntary
        start_ctx = process.num_ctx_switches()
        # Resource usage dari modul resource (digunakan untuk CPU time dan peak memory)
        # rusage_start = resource.getrusage(resource.RUSAGE_SELF)
        # === Eksekusi Fungsi yang Diukur ===
        result = func(*args, **kwargs)
        # === Metrik Akhir ===
        # end_time = time.perf_counter()
        # end_mem = process.memory_info().rss
        # end_cpu = process.cpu_times()
        # try:
        #     end_io = process.io_counters()
        # except AttributeError:
        #     end_io = None
        # end_ctx = process.num_ctx_switches()
        # # rusage_end = resource.getrusage(resource.RUSAGE_SELF)
        # # === Penghitungan Metrik ===
        # elapsed_time = end_time - start_time
        # mem_diff_kb = (end_mem - start_mem) / 1024  # dalam KB
        # # CPU times menggunakan psutil (selisih penggunaan per mode)
        # cpu_time_user = end_cpu.user - start_cpu.user
        # cpu_time_system = end_cpu.system - start_cpu.system
        # total_cpu_time = cpu_time_user + cpu_time_system
        # # CPU time berdasarkan resource module
        # rusage_cpu_time = ((rusage_end.ru_utime - rusage_start.ru_utime) +
        #                    (rusage_end.ru_stime - rusage_start.ru_stime))
        # # Total CPU usage (persentase) dihitung sebagai CPU time relatif terhadap elapsed time
        # # Nilai bisa melebihi 100% pada sistem multi-core
        # total_cpu_percent = (rusage_cpu_time / elapsed_time) * 100
        # # Mendapatkan jumlah core logis untuk perhitungan rata-rata per core
        # num_cores = psutil.cpu_count(logical=True)
        # avg_cpu_percent = total_cpu_percent / num_cores  # rata-rata per core
        # effective_cores_used = total_cpu_percent / 100   # misal: 579.60% => 5.80 core
        # # Peak memory usage (ru_maxrss sudah dalam KB pada Linux)
        # peak_mem = rusage_end.ru_maxrss
        # # Context switches: hitung selisih voluntary dan involuntary
        # voluntary_cs = end_ctx.voluntary - start_ctx.voluntary
        # involuntary_cs = end_ctx.involuntary - start_ctx.involuntary
        # # I/O operations (jika didukung)
        # if start_io and end_io:
        #     read_bytes = end_io.read_bytes - start_io.read_bytes
        #     write_bytes = end_io.write_bytes - start_io.write_bytes
        # else:
        #     read_bytes, write_bytes = None, None
        # # === Logging Hasil Benchmark ===
        # logger.info(
        #     f"{func.__name__} execution metrics:\n"
        #     f"Elapsed time         : {elapsed_time:.4f} seconds\n"
        #     f"User CPU time        : {cpu_time_user:.4f} seconds\n"
        #     f"System CPU time      : {cpu_time_system:.4f} seconds\n"
        #     f"Total CPU time       : {total_cpu_time:.4f} seconds\n"
        #     f"Resource CPU time    : {rusage_cpu_time:.4f} seconds\n"
        #     f"Total CPU usage      : {total_cpu_percent:.2f}%\n"
        #     f"Average usage per core: {avg_cpu_percent:.2f}% (total {num_cores} cores)\n"
        #     f"Effective cores used : {effective_cores_used:.2f} full cores\n"
        #     f"Memory diff          : {mem_diff_kb:.2f} KB\n"
        #     f"Peak memory          : {peak_mem} KB\n"
        #     f"Context switches     : voluntary={voluntary_cs}, involuntary={involuntary_cs}\n"
        #     f"I/O operations       : read_bytes={read_bytes if read_bytes is not None else 'N/A'}, "
        #     f"write_bytes={write_bytes if write_bytes is not None else 'N/A'}"
        # )
        return result
    return wrapper


class JobRecommender:
<<<<<<< HEAD
    def __init__(self, port="tcp://0.0.0.0:5555", title_weight=0.3, detail_weight=0.7, minimum_similarity=0.44):
=======
    def __init__(self, port="tcp://127.0.0.1:5555", title_weight=0.3, detail_weight=0.7, minimum_similarity=0.44):
>>>>>>> d7b606e12cb92238e67bccc72e4ad6563e2db204
        """
        Inisialisasi model, ZeroMQ, dan bobot custom untuk perhitungan similarity.
        title_weight  : bobot untuk similarity dari job title.
        detail_weight : bobot untuk similarity dari job details.
        """
        # Benchmark saat loading model
        self.model = self.load_model('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')
        self.context = zmq.Context()
        self.socket = self.context.socket(zmq.REP)
        self.socket.bind(port)
        print(f"Python server listening on port {port}...")
        self.title_weight = title_weight
        self.detail_weight = detail_weight
        self.minimum_similarity = minimum_similarity
        try:
            self.stop_words_en = set(nltk.corpus.stopwords.words('english'))
            self.stop_words_id = set(nltk.corpus.stopwords.words('indonesian'))
        except LookupError:
            nltk.download('stopwords')
            self.stop_words_en = set(nltk.corpus.stopwords.words('english'))
            self.stop_words_id = set(nltk.corpus.stopwords.words('indonesian'))
        self.stop_words = self.stop_words_en.union(self.stop_words_id)
        print('Server successfully started')

    @benchmark
    def load_model(self, model_name):
        """
        Meload model SentenceTransformer dan mengukur waktu serta penggunaan resource.
        """
        return SentenceTransformer(model_name)

    def preprocess_text(self, text: str) -> str:
        """
        Preprocessing teks:
         - Ganti newline dengan titik dan spasi,
         - Lowercase,
         - Hapus spasi ekstra,
         - Hapus tanda baca,
         - Hapus angka,
         - Hapus stopwords bahasa Inggris dan Indonesia.
        """
        if not text:
            return ""

        text = text.replace("\n", ". ")
        text = text.lower().strip()

        # Hapus tanda baca
        text = text.translate(str.maketrans('', '', string.punctuation))

        # Hapus angka (opsional)
        text = re.sub(r'\d+', '', text)

        # Hapus spasi ekstra
        text = re.sub(r'\s+', ' ', text)

        # Hapus stopwords gabungan
        words = text.split()
        filtered_words = [w for w in words if w not in self.stop_words]

        return ' '.join(filtered_words)

    @lru_cache(maxsize=512)
    def encode_text(self, text: str):
        """
        Melakukan encoding teks setelah dipreproses.
        """
        preprocessed_text = self.preprocess_text(text)
        embedding = self.model.encode(preprocessed_text, convert_to_tensor=True)
        return embedding
    
    def process_skills_requirement(self, skills):
        """
        Menggabungkan array skills menjadi satu string.
        """
        skill_text_list = []
        if isinstance(skills, list):
            for skill_item in skills:
                if isinstance(skill_item, dict) and "skill" in skill_item:
                    skill_text_list.append(skill_item["skill"])
        return ". ".join(skill_text_list)
    
    def process_skills(self, skills):
        """
        Menggabungkan array skills menjadi satu string.
        """
        skill_text_list = []
        if isinstance(skills, list):
            for skill_item in skills:
                if isinstance(skill_item, dict) and "skill_name" in skill_item:
                    skill_text_list.append(skill_item["skill_name"])
        return ". ".join(skill_text_list)

    def process_education(self, education):
        """
        Mengubah objek education menjadi satu string.
        Education berupa dict dengan key: degree, major, grade.
        """
        degree = education.get("degree", "")
        major = education.get("major", "")
        grade = education.get("grade", "")
        
        edu_text_parts = []
        if degree:
            edu_text_parts.append(degree)
        if major:
            edu_text_parts.append(major)
        if grade:
            edu_text_parts.append(f"Grade: {grade}")
        
        edu_text = ", ".join(edu_text_parts)
        return edu_text


    def process_experience(self, experiences):
        """
        Menggabungkan array experience menjadi satu string.
        Setiap elemen experience berupa dict dengan key: experience_title, description.
        """
        experience_text_list = []
        if isinstance(experiences, list):
            for exp in experiences:
                title = exp.get("experience_title", "")
                description = exp.get("description", "")
                if title and description:
                    exp_text = f"{title} - {description}"
                else:
                    exp_text = title or description
                if exp_text:
                    experience_text_list.append(exp_text)
        return ". ".join(experience_text_list)
    
    def process_project(self, projects):
        """
        Menggabungkan array project menjadi satu string.
        Setiap elemen project berupa dict dengan key: project_name, description.
        """
        project_text_list = []
        if isinstance(projects, list):
            for prj in projects:
                title = prj.get("project_name", "")
                description = prj.get("description", "")
                if title and description:
                    prj_text = f"{title} - {description}"
                else:
                    prj_text = title or description
                if prj_text:
                    project_text_list.append(prj_text)
        return ". ".join(project_text_list)
    
    def process_certifications(self, certifications):
        """
        Process certification information into text format.
        """
        cert_text_list = []
        if isinstance(certifications, list):
            for cert in certifications:
                name = cert.get("certification_name", "")
                if name:
                    cert_text = f"{name}"
                    cert_text_list.append(cert_text)
        return ". ".join(cert_text_list)

    def process_lms(self, lms_data):
        """
        Process LMS data into text format.
        """
        lms_text_list = []
        if isinstance(lms_data, list):
            for course in lms_data:
                course_name = course.get("title", "")
                description = course.get("description", "")
                category = course.get("category", "")
                if course_name and description:
                    lms_text_list.append(f"{course_name} - {description} ({category})")
        return ". ".join(lms_text_list)

    def get_user_details_text(self, user):
        """
        Menggabungkan personal_summary, education, dan experience user menjadi satu string.
        """
        personal_summary = user.get("personal_summary", "")
        education = self.process_education(user.get("education", []))
        experience = self.process_experience(user.get("experiences", []))
        projects = self.process_project(user.get("projects", []))
        certifications = self.process_certifications(user.get("certifications", []))
        skills = self.process_skills(user.get("skills", []))
        lms = self.process_lms(user.get("lms", []))
        user_details = f"{personal_summary}. {education}. {experience}. {projects}. {skills}. {certifications}. {lms}".strip()
        return user_details

    def get_job_details_text(self, job):
        """
        Menggabungkan detail job dari field: description, education_requirement, dan experience_requirement.
        """
        job_description = self.preprocess_text(job.get("description", ""))
        edu_req = self.preprocess_text(job.get("education_requirement", ""))
        exp_req = self.preprocess_text(job.get("experience_requirement", ""))
        skl_req = self.process_skills_requirement(job.get("skills_requirement", ""))
        job_details = f"{job_description}. {edu_req}. {exp_req}. {skl_req}".strip()
        return job_details

    def get_job_title_text(self, job):
        """
        Mengambil teks judul pekerjaan (job title) dan melakukan preprocessing.
        """
        title = job.get("title", "")
        return self.preprocess_text(title)

    @lru_cache(maxsize=1024)
    def compute_similarity_score(self, ref_embedding, text: str) -> float:
        """
        Menghitung cosine similarity antara ref_embedding dengan embedding dari teks yang diberikan.
        Jika teks kosong, mengembalikan 0.
        """
        if not text:
            return 0.0
        text_embedding = self.encode_text(text)
        similarity = util.pytorch_cos_sim(ref_embedding, text_embedding).item()
        # Remap similarity ke rentang [0..1] dan pastikan tidak negatif
        similarity = self._remap_similarity(similarity)
        return max(similarity, 0.0)  

    @lru_cache(maxsize=1024)
    def compute_common_word_bonus(self, text1: str, text2: str) -> float:
        if not text1 or not text2:
            return 0.0
        segments1 = [seg.strip() for seg in text1.split('.') if seg.strip()]
        total_bonus = 0.0
        for seg1 in segments1:
            score = self.compute_similarity_score(self.encode_text(seg1), text2)
            # print(f"Similarity between '{seg1}' and '{text2}': {score}")
            if score >= 0.5:
                bonus = (score - 0.5) * 0.6  # bonus proporsional
                total_bonus += bonus
        return min(total_bonus, 0.3)  # batasi maksimal bonus 0.3
    
    def auto_correct_text(self, text: str) -> str:
        """
        Auto correct teks menggunakan library autocorrect.
        Jika library tidak tersedia, fungsi ini akan mengembalikan teks asli.
        """
        if not text:
            return text
        spell = Speller(lang='en')
        corrected = spell(text)
        return corrected
    
    @lru_cache(maxsize=1024)
    def compute_component_similarity(self, component_text, job_details_text):
        """
        Calculate similarity between a specific user profile component and job details.
        Returns a percentage value (0-100).
        """
        if not component_text or not job_details_text:
            return 0.0
            
        component_embedding = self.encode_text(component_text)
        job_details_embedding = self.encode_text(job_details_text)
        
        similarity = util.pytorch_cos_sim(component_embedding, job_details_embedding).item()
        # Remap similarity to [0..1] range
        similarity = self._remap_similarity(similarity)
        # Convert to percentage (0-100)
        return round(similarity * 100, 2)

    @benchmark
    def handle_job_recommendation(self, request_data):
        """
        Menangani request untuk rekomendasi pekerjaan:
        - Mendeteksi apakah input jobs adalah array atau single job
        - Menghitung similarity dari job title dan job details berdasarkan user details.
        - Menambahkan bonus jika terdapat kata yang sama antara personal_summary dan job title.
        - Menggabungkan skor menggunakan bobot custom.
        - Mengembalikan respons berupa array job_id, title, dan similarity_score.
        """
        user = request_data.get("user", {})
        data_lms = request_data.get("lms", [])
        user["lms_data"] = data_lms
        jobs_input = request_data.get("jobs", [])
        sort_fields = request_data.get("sort", [])
        is_sort = request_data.get("is_sort", "false")
        is_filter = request_data.get("filter", "true")
        
        # Check if jobs_input is an array or a single job
        if not isinstance(jobs_input, list):
            # If it's a single job, convert it to a list with one element
            jobs = [jobs_input]
        else:
            # If it's already a list, use it as is
            jobs = jobs_input
        
        # Extract all user components individually
        personal_summary = user.get("personal_summary", "")
        skills_text = self.process_skills(user.get("skills", []))
        education_text = self.process_education(user.get("education", []))
        experience_text = self.process_experience(user.get("experiences", []))
        projects_text = self.process_project(user.get("projects", []))
        certifications_text = self.process_certifications(user.get("certifications", []))
        lms_text = self.process_lms(data_lms)

        component_texts = {
            "personal_summary": personal_summary,
            "skills": skills_text,
            "education": education_text,
            "experience": experience_text,
            "projects": projects_text,
            "certifications": certifications_text,
            "lms": lms_text
        }

        # --- 3. Tentukan teks & embedding untuk user_details ---
        if sort_fields and is_sort == "true":
            print(f"Sorting components: {sort_fields}")
            # Gabungkan hanya teks komponen yang di-sort
            selected_texts = [
                component_texts[f] for f in sort_fields
                if component_texts.get(f)
            ]
            if not selected_texts:
                self.socket.send_json({"error": "Komponen sort tidak valid atau kosong."})
                return
            user_details_text = " ".join(selected_texts)
        else:
            # Default: semua komponen digabung
            user_details_text = self.get_user_details_text(user)
        
        if not user_details_text:
            self.socket.send_json({"error": "Detail user tidak lengkap."})
            return
            
        user_embedding = self.encode_text(user_details_text)
        results = []
        combined_text_for_bonus = skills_text
        
        for job in jobs:
            # Ambil job title dan job details
            job_id = job["job_id"]
            job_title_text = self.get_job_title_text(job)
            job_details_text = self.get_job_details_text(job)

            job_details_embedding = self.encode_text(job_details_text)
                        
            # Hitung similarity job dengan user details
            title_similarity = self.compute_similarity_score(user_embedding, job_title_text)
            detail_similarity = util.pytorch_cos_sim(user_embedding, job_details_embedding).item()
            bonus = self.compute_common_word_bonus(combined_text_for_bonus, job_title_text)
            final_similarity = (self.title_weight * title_similarity) + (self.detail_weight * detail_similarity) + bonus
            
            # Hitung similarity untuk setiap komponen user
            component_matches = {}
            for key, text in component_texts.items():
                if is_sort == "true" and is_filter == "true" and key not in sort_fields:
                    continue
                match_key = f"{key}_match"
                if text:
                    emb = self.encode_text(text)
                    sim = util.pytorch_cos_sim(emb, job_details_embedding).item()
                    sim = self._remap_similarity(sim)
                    component_matches[match_key] = round(sim * 100, 2)
                else:
                    component_matches[match_key] = 0.0
            
            # Simpan hasil rekomendasi pekerjaan
            job_result = {
                "job_id": job["job_id"],
                "title": job["title"],
                "similarity_score": final_similarity,
                "bonus": bonus,
                "match_details": component_matches
            }
            if len(jobs) == 1:
                print(json.dumps(job_result, indent=2, default=str))

            results.append(job_result)
        
        if is_filter == "false":
            self.minimum_similarity = 0
        else:
            self.minimum_similarity = 0.44
        print(user_details_text)
        # Filter dan urutkan hasil berdasarkan threshold similarity
        filtered_jobs = [job for job in results if job.get("similarity_score", 0) >= self.minimum_similarity]
        sorted_jobs = sorted(filtered_jobs, key=lambda x: x["similarity_score"], reverse=True)
        
        print(json.dumps(sorted_jobs[:3], indent=2, default=str))
        response = {"jobs": sorted_jobs}
        self.socket.send_json(response)

    @benchmark
    def handle_job_search(self, request_data):
        """
        Menangani request pencarian pekerjaan berdasarkan search text:
         - Mengambil search_text dan daftar job dari request_data.
         - Melakukan auto correction untuk menangani typo pada search text.
         - Melakukan encoding pada search_text yang sudah diperbaiki.
         - Menghitung similarity antara search_text dengan job title dan job details.
         - Memprioritaskan jika job title terdapat di dalam search text dengan tambahan bonus.
         - Menggabungkan skor berdasarkan bobot custom.
         - Memfilter dan mengurutkan job berdasarkan nilai minimum similarity.
         - Mengembalikan respons berupa job_id, title, dan similarity_score.
        """
        # Ambil dan auto correct search_text
        search_text = request_data.get("search_text", "")
        if not search_text:
            self.socket.send_json({"error": "Search text tidak ditemukan."})
            return

        corrected_search_text = self.auto_correct_text(search_text)
        if corrected_search_text != search_text:
            logger.info(f"Search text diperbaiki dari '{search_text}' menjadi '{corrected_search_text}'")
        search_text = corrected_search_text

        # Ambil daftar job dari request_data
        jobs = request_data.get("jobs", [])
        if not jobs:
            self.socket.send_json({"error": "Daftar jobs tidak ditemukan."})
            return

        # Encode search_text yang sudah diperbaiki
        search_embedding = self.encode_text(search_text)
        results = []
        for job in jobs:
            # Hitung similarity untuk job title
            job_title_text = self.get_job_title_text(job)
            title_similarity = self.compute_similarity_score(search_embedding, job_title_text)
            # Hitung similarity untuk job details
            job_details_text = self.get_job_details_text(job)
            detail_similarity = self.compute_similarity_score(search_embedding, job_details_text)
            # Bonus jika job title muncul secara eksplisit di search text
            bonus_title_match = 0.4 if job_title_text and (job_title_text in search_text or search_text in job_title_text) else 0
            # Bonus tambahan jika terdapat kata yang sama diantara search_text dan job title
            bonus_common = self.compute_common_word_bonus(search_text, job_title_text)
            bonus = bonus_title_match + bonus_common
            # Gabungkan skor dengan bobot custom dan bonus
            final_similarity = (self.title_weight * title_similarity) + (self.detail_weight * detail_similarity) + bonus

            job["title_similarity"] = title_similarity
            job["detail_similarity"] = detail_similarity
            job["bonus"] = bonus
            job["similarity_score"] = final_similarity
            results.append(job)

        # Filter dan urutkan job berdasarkan threshold similarity
        filtered_jobs = [job for job in results if job.get("similarity_score", 0) >= 0.44]
        sorted_jobs = sorted(filtered_jobs, key=lambda x: x["similarity_score"], reverse=True)
        job_list = [
            {"job_id": job["job_id"], "title": job["title"], "similarity_score": job["similarity_score"]}
            for job in sorted_jobs
        ]
        response = {"jobs": job_list}
        self.socket.send_json(response)

    def handle_request(self):
        """
        Menangani request umum dengan routing berdasarkan action.
        """
        try:
            request_data = self.socket.recv_json()
        except Exception as e:
            error_response = {"error": f"Invalid JSON input: {str(e)}"}
            self.socket.send_json(error_response)
            return

        # Dapatkan action; default "job_recommendation"
        action = request_data.get("action", "job_recommendation")
        if action == "ping":
            # Respon untuk ping agar client tahu server aktif
            self.socket.send_json("pong")
            return
        if action == "job_recommendation":
            self.handle_job_recommendation(request_data)
        elif action == "job_search":
            self.handle_job_search(request_data)
        else:
            self.socket.send_json({"error": f"Action '{action}' tidak dikenali."})

    def run(self):
        """
        Menjalankan server secara terus-menerus.
        """
        while True:
            self.handle_request()

    @lru_cache(maxsize=1024)
    def _remap_similarity(self, raw: float, raw_min: float = -0.2, raw_max: float = 1.0) -> float:
        """
        Remap raw cosine similarity dari [raw_min..raw_max] ke [0..1], 
        lalu clamp supaya tetap di [0..1].
        """
        scaled = (raw - raw_min) / (raw_max - raw_min)
        return min(max(scaled, 0.0), 1.0)


if __name__ == "__main__":
    recommender = JobRecommender(title_weight=0.3, detail_weight=0.7)
    recommender.run()