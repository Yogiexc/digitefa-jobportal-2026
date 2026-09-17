import zmq
import json

context = zmq.Context()
socket = context.socket(zmq.REQ)
socket.connect("tcp://127.0.0.1:5556")

payload = {
    "action": "talent_recommendation",
    "job": {
        "job_id": "job123",
        "title": "Software Engineer",
        "description": "Looking for a Python developer with experience in API development.",
        "education_requirement": "Bachelor in Computer Science",
        "experience_requirement": "2 years in web development",
        "skills_requirement": [{"skill": "Python"}, {"skill": "API"}]
    },
    "talents": [
        {
            "job_seeker_id": "talent001",
            "full_name": "John Doe",
            "personal_summary": "I am a skilled Python developer.",
            "skills": [{"skill_name": "Python"}, {"skill_name": "Django"}, {"skill_name": "API"}],
            "education": {"degree": "Bachelor", "major": "Computer Science", "grade": "3.8"},
            "experiences": [{"experience_title": "Backend Dev", "description": "3 years API development"}],
            "projects": [],
            "certifications": [],
            "lms": []
        }
    ]
}

socket.send_json(payload)
response = socket.recv_json()
print(json.dumps(response, indent=2))
