import requests
import json
import os

NEST_API_URL = os.getenv("NEST_API_URL", "http://127.0.0.1:3000/api")
JOBS_LIST_API = NEST_API_URL + "/jobs-search?pageSize=100"
TALENTS_API = NEST_API_URL + "/job-seekers?pageSize=30"
LOGIN_API = NEST_API_URL + "/auth/login/cms"

EMAIL = "admin@mail.com"   # Ganti jika email admin Anda berbeda
PASSWORD = "admin123"      # Ganti jika password-nya berbeda

print("Menghubungkan ke: " + NEST_API_URL)

headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
}

try:
    # 1. Login CMS untuk mendapatkan Token Admin/Company
    print(f"Mencoba login via {LOGIN_API}...")
    login_payload = {"email": EMAIL, "password": PASSWORD}
    login_response = requests.post(LOGIN_API, json=login_payload, headers=headers, timeout=5)
    
    if login_response.status_code in [200, 201]:
        res_data = login_response.json()
        token = (
            res_data.get("token") or 
            res_data.get("access_token") or 
            res_data.get("data", {}).get("token") or 
            res_data.get("data", {}).get("access_token")
        )
        if not token:
            print("Login sukses, tapi token tidak ditemukan.")
            exit()
        print("Login SUKSES! Token berhasil didapatkan.")
        headers["Authorization"] = f"Bearer {token}"
    else:
        print(f"Gagal login: {login_response.text}")
        exit()

    # 2. Ambil list Jobs dasar
    print("Mengambil list jobs dasar...")
    job_response = requests.get(JOBS_LIST_API, timeout=5)
    job_response.raise_for_status()
    all_jobs = job_response.json().get("data", [])
    
    # Filter for 2 jobs from Company 6 with title 'Public Health Consultant'
    jobs_basic = []
    for job in all_jobs:
        title = job.get("title", "").lower()
        company_data = job.get("company", {})
        market_name = company_data.get("market_name", "").lower()
        legal_name = company_data.get("legal_name", "").lower()
        
        if title == "public health consultant" and ("company 6" in market_name or "company 6" in legal_name):
            jobs_basic.append(job)
            
    print(f"Mengekstrak detail untuk {len(jobs_basic)} job (Public Health Consultant - Company 6)...")

    # 3. Ambil Detail Lengkap masing-masing Job (untuk mendapatkan description)
    jobs_full_data = []
    for job in jobs_basic:
        job_id = job.get("job_id")
        title = job.get("title", "Unknown")
        
        # Coba hit endpoint detail spesifik job
        # Mencoba /jobs-search/{id} atau /jobs/{id}
        detail_url = f"{NEST_API_URL}/jobs-search/{job_id}"
        print(f"  > Mengambil detail job: {title} (ID: {job_id[:8]}...)")
        try:
            r = requests.get(detail_url, timeout=5)
            if r.status_code == 200:
                j_detail = r.json()
                if isinstance(j_detail, dict) and "data" in j_detail:
                    j_detail = j_detail["data"]
                jobs_full_data.append(j_detail)
            else:
                # Jika /jobs-search/{id} gagal, coba /jobs/{id}
                alt_url = f"{NEST_API_URL}/jobs/{job_id}"
                r_alt = requests.get(alt_url, timeout=5)
                if r_alt.status_code == 200:
                    j_detail = r_alt.json()
                    if isinstance(j_detail, dict) and "data" in j_detail:
                        j_detail = j_detail["data"]
                    jobs_full_data.append(j_detail)
                else:
                    print(f"    Gagal mengambil detail ({r.status_code}), menggunakan data list dasar.")
                    jobs_full_data.append(job)
        except Exception as e:
            print(f"    Error mengambil detail: {e}")
            jobs_full_data.append(job)

    # 4. Ambil data list job-seekers basic
    print("Mengambil list job-seekers dasar...")
    talent_response = requests.get(TALENTS_API, headers=headers, timeout=5)
    talent_response.raise_for_status()
    res_talents = talent_response.json()
    talents_basic = res_talents.get("data", []) if isinstance(res_talents, dict) else res_talents
    
    if isinstance(talents_basic, dict) and "data" in talents_basic:
        talents_basic = talents_basic["data"]

    # 5. Ambil detail lengkap untuk masing-masing talent
    talents_full_data = []
    print(f"Mengambil detail relasi untuk {len(talents_basic)} talent...")
    for talent in talents_basic:
        js_id = talent.get("job_seeker_id")
        name = talent.get("full_name", "Unknown")
        detail_url = f"{NEST_API_URL}/job-seekers/{js_id}"
        print(f"  > Mengambil data lengkap untuk: {name} (ID: {js_id[:8]}...)")
        try:
            r = requests.get(detail_url, headers=headers, timeout=5)
            if r.status_code == 200:
                t_detail = r.json()
                if isinstance(t_detail, dict) and "data" in t_detail:
                    t_detail = t_detail["data"]
                talents_full_data.append(t_detail)
            else:
                talents_full_data.append(talent)
        except Exception as e:
            talents_full_data.append(talent)

    # Simpan ke samples.json
    samples = {
        "jobs": jobs_full_data,
        "talents": talents_full_data
    }

    with open("samples.json", "w", encoding="utf-8") as f:
        json.dump(samples, f, indent=4, ensure_ascii=False)

    print("\nBerhasil! Data pekerjaan dan talent yang LENGKAP disimpan di samples.json")

except Exception as e:
    print("Gagal: " + str(e))
