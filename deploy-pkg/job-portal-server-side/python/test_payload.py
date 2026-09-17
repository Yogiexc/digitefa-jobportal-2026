import zmq
import json
# Inisialisasi context ZeroMQ
context = zmq.Context()
socket = context.socket(zmq.REQ)
socket.connect("tcp://127.0.0.1:5555")

# Siapkan data JSON sesuai dengan format yang diharapkan server
payload = {
 "user": {
 "personal_summary": "Saya adalah seorang engineer dengan pengalaman 5 tahun.",
 "education": { "degree": "S1", "major": "Teknik Informatika", "grade": "3.5" },
 "experience": [{ "experience_title": "Software Engineer", "description": "Mengembangkan aplikasi web." }]
 },
 "jobs": [
 {
 "job_id": 1,
 "title": "Software Developer",
 "description": "Membuat dan memelihara aplikasi.",
 "education_requirement": "S1 Teknik Informatika",
 "experience_requirement": "Minimal 3 tahun pengalaman.."
 },
 {
 "job_id": 2,
 "title": "Data Analyst",
 "description": "Menganalisis data dan membuat laporan.",
 "education_requirement": "S1 Statistik",
 "experience_requirement": "Pengalaman di bidang analisis data."
 }
 ]
}

# Kirim request
socket.send_json(payload)

# Terima response dari server
response = socket.recv_json()
print("Response:", json.dumps(response, indent=2))