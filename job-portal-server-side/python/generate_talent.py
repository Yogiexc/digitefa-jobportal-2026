import re
import sys

with open('job_recommender_server.py', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace('class JobRecommender:', 'class TalentRecommender:')
code = code.replace('port="tcp://0.0.0.0:5555"', 'port="tcp://0.0.0.0:5556"')
code = code.replace('JobRecommender(title_weight=0.3, detail_weight=0.7)', 'TalentRecommender(title_weight=0.3, detail_weight=0.7)')
code = code.replace('action = request_data.get("action", "job_recommendation")', 'action = request_data.get("action", "talent_recommendation")')
code = code.replace('if action == "job_recommendation":', 'if action == "talent_recommendation":')
code = code.replace('self.handle_job_recommendation(request_data)', 'self.handle_talent_recommendation(request_data)')

handle_talent = '''
    @benchmark
    def handle_talent_recommendation(self, request_data):
        job = request_data.get("job", {})
        talents_input = request_data.get("talents", [])
        sort_fields = request_data.get("sort", [])
        is_sort = request_data.get("is_sort", "false")
        is_filter = request_data.get("filter", "true")
        
        if not isinstance(talents_input, list):
            talents = [talents_input]
        else:
            talents = talents_input
            
        job_title_text = self.get_job_title_text(job)
        job_details_text = self.get_job_details_text(job)
        
        if not job_details_text:
            self.socket.send_json({"error": "Detail job tidak lengkap."})
            return
            
        job_embedding = self.encode_text(job_details_text)
        results = []
        
        for talent in talents:
            talent_id = talent.get("job_seeker_id", talent.get("user_id", ""))
            data_lms = talent.get("lms", [])
            
            personal_summary = talent.get("personal_summary", "")
            skills_text = self.process_skills(talent.get("skills", []))
            education_text = self.process_education(talent.get("education", []))
            experience_text = self.process_experience(talent.get("experiences", []))
            projects_text = self.process_project(talent.get("projects", []))
            certifications_text = self.process_certifications(talent.get("certifications", []))
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
            
            if sort_fields and is_sort == "true":
                selected_texts = [
                    component_texts[f] for f in sort_fields
                    if component_texts.get(f)
                ]
                if not selected_texts:
                    continue
                user_details_text = " ".join(selected_texts)
            else:
                user_details_text = self.get_user_details_text(talent)
                
            if not user_details_text:
                continue
                
            user_embedding = self.encode_text(user_details_text)
            
            title_similarity = self.compute_similarity_score(user_embedding, job_title_text)
            detail_similarity = util.pytorch_cos_sim(user_embedding, job_embedding).item()
            bonus = self.compute_common_word_bonus(skills_text, job_title_text)
            final_similarity = (self.title_weight * title_similarity) + (self.detail_weight * detail_similarity) + bonus
            
            component_matches = {}
            for key, text in component_texts.items():
                if is_sort == "true" and is_filter == "true" and key not in sort_fields:
                    continue
                match_key = f"{key}_match"
                if text:
                    emb = self.encode_text(text)
                    sim = util.pytorch_cos_sim(emb, job_embedding).item()
                    sim = self._remap_similarity(sim)
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
            
        if is_filter == "false":
            self.minimum_similarity = 0
        else:
            self.minimum_similarity = 0.44
            
        filtered_talents = [t for t in results if t.get("similarity_score", 0) >= self.minimum_similarity]
        sorted_talents = sorted(filtered_talents, key=lambda x: x["similarity_score"], reverse=True)
        
        response = {"talents": sorted_talents}
        self.socket.send_json(response)
'''

code = re.sub(r'    @benchmark\n    def handle_job_recommendation\(self, request_data\):.*?(?=    @benchmark\n    def handle_job_search)', handle_talent + '\n', code, flags=re.DOTALL)
code = re.sub(r'    @benchmark\n    def handle_job_search\(self, request_data\):.*?(?=    def handle_request)', '', code, flags=re.DOTALL)
code = code.replace('elif action == "job_search":\n            self.handle_job_search(request_data)\n', '')

with open('talent_recommender_server.py', 'w', encoding='utf-8') as f:
    f.write(code)
print("talent_recommender_server.py generated successfully.")
