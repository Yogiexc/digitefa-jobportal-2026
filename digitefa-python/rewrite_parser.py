import os

file_path = "main.py"
with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_content = []
in_parse_cv = False
for line in lines:
    if "def parse_cv(file: UploadFile = File(...)):" in line:
        in_parse_cv = True
        new_content.append(line)
        new_content.append('''    """
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
                    full_text += text + "\\n"
                    
        cv_lines = full_text.split('\\n')
        sections = {
            "name": "", "email": "", "phone": "", "address": "", "date_of_birth": "",
            "personal_summary": [], "skills": [], "experience": [], 
            "education": [], "projects": [], "certifications": [], "languages": []
        }
        
        email_regex = re.compile(r"([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+)")
        phone_regex = re.compile(r"(\\+?\\d[\\d -]{8,15})")
        dob_regex = re.compile(r"(?i)(?:ttl|lahir|dob|date of birth)[:\\s]*(\\d{1,2}[\\s\\-/]+[a-zA-Z0-9]{2,10}[\\s\\-/]+\\d{2,4})")
        address_regex = re.compile(r"(?i)(?:alamat|address|domisili)[:\\s]+([^=\\n]{5,50})")
        
        emails = email_regex.findall(full_text)
        if emails: sections["email"] = emails[0]
            
        phones = phone_regex.findall(full_text)
        if phones: sections["phone"] = phones[0]
            
        dobs = dobs = dob_regex.findall(full_text)
        if dobs: sections["date_of_birth"] = dobs[0].strip()
            
        addresses = address_regex.findall(full_text)
        if addresses: sections["address"] = addresses[0].strip()

        for line in cv_lines:
            line_clean = line.strip()
            import re as local_re
            if line_clean and len(line_clean) < 40:
                l_lower = line_clean.lower()
                if not any(bw in l_lower for bw in ['resume', 'cv', 'curriculum vitae', 'profil', 'data pribadi', 'contact']):
                    sections["name"] = line_clean
                    break
                    
        current_section = None
        header_patterns = {
            "experience": r"^(pengalaman|experience|work history|employment|riwayat kerja)",
            "education": r"^(pendidikan|education|academic|riwayat pendidikan)",
            "skills": r"^(keahlian|skills|keterampilan|kemampuan)",
            "personal_summary": r"^(summary|profile|profil|tentang saya|about me|ringkasan)",
            "projects": r"^(projects|proyek|portfolio|portofolio)",
            "certifications": r"^(certifications|sertifikat|lisensi|licenses|sertifikasi)",
            "languages": r"^(languages|bahasa)"
        }
        
        for line in cv_lines:
            lline = line.lower().strip()
            matched_section = False
            
            if len(lline) < 50 and lline:
                for sec, pattern in header_patterns.items():
                    if re.search(pattern, lline):
                        current_section = sec
                        matched_section = True
                        break
            
            if not matched_section and current_section and line.strip():
                if current_section in ["skills", "languages"]:
                    parts = [p.strip() for p in re.split(r'[,|•;*]', line) if p.strip()]
                    sections[current_section].extend(parts)
                else:
                    sections[current_section].append(line.strip())
        
        stop_words = ["dalam tim", "teknologi baru", "kerjasama", "komunikasi", "problem solving", "tanggung jawab"]
        
        filtered_skills = []
        for s in sections["skills"]:
            s_clean = s.strip()
            if s_clean.isdigit() or len(s_clean) < 2 or len(s_clean) > 40: continue
            if phone_regex.match(s_clean) or s_clean.lower() in stop_words: continue
            filtered_skills.append(s_clean)
            
        sections["skills"] = list(set(filtered_skills))
        sections["languages"] = list(set([s.strip() for s in sections["languages"] if 1 < len(s.strip()) < 30]))
        sections["personal_summary"] = " ".join(sections["personal_summary"])
        
        valid_projects = [p for p in sections["projects"] if len(p.strip()) > 10]
        valid_certs = [c for c in sections["certifications"] if len(c.strip()) > 10]

        date_pattern = re.compile(r'\\b(?:19|20)\\d{2}\\b|(?i)(?:jan|feb|mar|apr|may|mei|jun|jul|aug|agu|sep|oct|okt|nov|dec|des)[a-z]*[\\s,-]+\\d{2,4}')
        
        def extract_dates(text):
            return date_pattern.findall(text)
            
        def clean_title(title, dates):
            for d in dates: title = title.replace(d, "").strip()
            return re.sub(r'^[\\W_]+|[\\W_]+$', '', title).strip()

        sections["projects_structured"] = []
        for line in valid_projects[:5]:
            dates = extract_dates(line)
            title = clean_title(line[:50], dates)
            sections["projects_structured"].append({
                "title": title or "Project",
                "description": line,
                "start_date": dates[0] if len(dates) > 0 else "",
                "end_date": dates[-1] if len(dates) > 1 else ""
            })
        sections["projects"] = " ".join(valid_projects)
        
        sections["certifications_structured"] = [{"title": "Cert", "description": c} for c in valid_certs[:5]]
        sections["certifications"] = " ".join(valid_certs)

        exp_list = []
        current_exp = None
        for line in sections["experience"]:
            line = line.strip()
            if not line: continue
            
            dates = extract_dates(line)
            if dates or current_exp is None or re.search(r' at | - | – ', line):
                if current_exp and current_exp["description"]:
                    exp_list.append(current_exp)
                
                parts = re.split(r' at | @ | - | – ', line, 1)
                title = clean_title(parts[0][:100], dates)
                company = clean_title(parts[1][:100], dates) if len(parts) > 1 else "Extracted Company"
                
                current_exp = {
                    "title": title or "Experience",
                    "company": company,
                    "description": "",
                    "start_date": dates[0] if len(dates) > 0 else "",
                    "end_date": dates[-1] if len(dates) > 1 else ("Present" if re.search(r'(?i)present|sekarang', line) else "")
                }
            else:
                current_exp["description"] += line + " "

        if current_exp: exp_list.append(current_exp)
        sections["experience_structured"] = exp_list[:10]
        sections["experience"] = " ".join(sections["experience"][:20])

        edu_list = []
        current_edu = None
        for line in sections["education"]:
            line = line.strip()
            if not line: continue
            dates = extract_dates(line)
            if dates or current_edu is None or "univ" in line.lower() or "institut" in line.lower() or "school" in line.lower() or "sekolah" in line.lower():
                if current_edu and current_edu["university"]:
                    edu_list.append(current_edu)
                univ = clean_title(line[:50], dates)
                current_edu = {
                    "university": univ or "Education from CV",
                    "degree": "",
                    "major": "",
                    "description": line + " ",
                    "start_date": dates[0] if len(dates) > 0 else "",
                    "end_date": dates[-1] if len(dates) > 1 else ""
                }
            else:
                current_edu["description"] += line + " "
                
        if current_edu: edu_list.append(current_edu)
        if not edu_list and sections["education"]:
            edu_list.append({"university": "From CV", "degree": "", "major": "", "description": " ".join(sections["education"][:10]), "start_date": "", "end_date": ""})
            
        sections["education_structured"] = edu_list[:5]
        sections["education"] = " ".join(sections["education"][:10])
        
        return {
            "parsed_data": sections,
            "raw_text": full_text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
''')
        continue
    
    if in_parse_cv:
        if "def get_wordcloud():" in line or "@app.get(\"/wordcloud\")" in line:
            in_parse_cv = False
            new_content.append(line)
    else:
        new_content.append(line)

with open(file_path, "w", encoding="utf-8") as f:
    f.writelines(new_content)
print("Updated main.py")
