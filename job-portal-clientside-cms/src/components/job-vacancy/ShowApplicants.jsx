import { useEffect, useState } from "react";
import { Button, Typography, Image, Form, Input } from "antd";
import Api from "../../services/Api";
import PersonalInformationIcon from "../../assets/svg/Personal.svg";
import PersonalSummaryIcon from "../../assets/svg/PersonalSummary.svg";
import EducationIcon from "../../assets/svg/Education.svg";
import CertificationIcon from "../../assets/svg/Certification.svg";
import ExperienceIcon from "../../assets/svg/Experience.svg";
import SkillIcon from "../../assets/svg/Skills.svg";
import ProjectIcon from "../../assets/svg/Project.svg";
import LanguageIcon from "../../assets/svg/Language.svg";
import BrokenImage from "../../assets/images/broken.jpg";

const { Text } = Typography;

const ShowApplicants = ({ onBack, applicantsId, jobSeekerId }) => {
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [jobSeekerData, setJobSeekerData] = useState("");

  useEffect(() => {
    const fetchJobSeekerDetails = () => {
      const endpoint = applicantsId
        ? `/jobs/applicants/detail/${applicantsId}`
        : `/jobs/seekers/detail/${jobSeekerId}`;

      Api.get(endpoint)
        .then((response) => {
          if (response && response.data) {
            // The backend wraps the response in { data: { jobSeeker: { ... } } }
            const data = response.data.jobSeeker || response.data;
            const profilePictureUrl = data.profile_picture_url
              ? `http://localhost:3000/${data.profile_picture_url.replace(
                /\\/g,
                "/"
              )}`
              : null;

            setJobSeekerData({
              full_name: data.job_seeker?.full_name || "Unknown Name",
              phone_number: data.personal_info?.phone_number || "-",
              email: data.job_seeker?.email || "-",
              date_of_birth: data.personal_info?.date_of_birth || null,
              address: data.personal_info?.address || "-",
              personal_summary: data.personal_summary || "",
              education: data.education || null,
              experience: data.experiences || [],
              skill: data.skills || [],
              project: data.projects || [],
              certification: data.certifications || [],
              language: data.languages || [],
            });

            if (profilePictureUrl) {
              setPreviewImage(profilePictureUrl);
            }
          } else {
            console.error("Unexpected response structure:", response);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch job seeker details:", error);
        });
    };

    fetchJobSeekerDetails();
  }, [applicantsId, jobSeekerId]);

  const handleBack = () => {
    onBack();
  };

  const formatDate = (date) => {
    if (!date) return "";
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return date; // Return raw string if invalid date
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    } catch (e) {
      return date;
    }
  };

  return (
    <div className="bg-white shadow rounded-[20px] p-8">
      
      {/* Profile Picture & Personal Info */}
      <div className="flex flex-col items-start mb-6">
        <div className="flex items-center mb-4">
          <img src={PersonalInformationIcon} alt="Personal Icon" className="w-12" />
          <Text className="text-xl font-semibold ml-4">Profile Picture</Text>
        </div>
        <div className="flex items-center mt-4">
          <Image
            width={100}
            height={100}
            className="rounded-full object-cover border border-gray-200"
            src={previewImage || BrokenImage}
            fallback={BrokenImage}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
            }}
          />
        </div>
      </div>

      <div className="flex items-center mb-6 mt-6">
        <img src={PersonalInformationIcon} alt="Personal Info Icon" className="w-12" />
        <Text className="text-xl font-semibold ml-4">Personal Information</Text>
      </div>

      <Form layout="vertical" requiredMark={false} size="large">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Form.Item label="Full Name">
            <Input disabled value={jobSeekerData.full_name} />
          </Form.Item>
          <Form.Item label="Phone Number">
            <Input disabled value={jobSeekerData.phone_number} />
          </Form.Item>
          <Form.Item label="Email" style={{ marginTop: "-16px" }}>
            <Input disabled value={jobSeekerData.email} />
          </Form.Item>
          <Form.Item label="Date of Birth" style={{ marginTop: "-16px" }}>
            <Input disabled value={jobSeekerData.date_of_birth ? new Date(jobSeekerData.date_of_birth).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }) : "-"} />
          </Form.Item>
          <Form.Item label="Address" style={{ marginTop: "-16px" }}>
            <Input.TextArea disabled value={jobSeekerData.address} style={{ height: "96px" }} />
          </Form.Item>
        </div>
      </Form>

      {/* Personal Summary */}
      <div className="flex items-center mb-6 mt-6">
        <img src={PersonalSummaryIcon} alt="Personal Summary Icon" className="w-12" />
        <Text className="text-xl font-semibold ml-4">Personal Summary</Text>
      </div>
      <Form layout="vertical" requiredMark={false} size="large">
        <Form.Item label="Summary">
          <Input.TextArea disabled value={jobSeekerData.personal_summary || "No personal summary available."} style={{ height: "96px" }} />
        </Form.Item>
      </Form>

      {/* Educational Information */}
      <div className="flex items-center mb-6 mt-6">
        <img src={EducationIcon} alt="Education Icon" className="w-12" />
        <Text className="text-xl font-semibold ml-4">Educational Information</Text>
      </div>
      <Form layout="vertical" requiredMark={false} size="large">
        {(!jobSeekerData.education || jobSeekerData.education.length === 0) ? (
          <Text className="text-gray-400 italic">No education available</Text>
        ) : jobSeekerData.education.map((edu, index) => (
          <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6 p-6 border rounded-xl bg-gray-50/30">
            <Form.Item label="University Name" style={{ marginBottom: "0px" }}>
              <Input disabled value={edu.university_name || edu.university || "-"} />
            </Form.Item>
            <Form.Item label="Major" style={{ marginBottom: "0px" }}>
              <Input disabled value={edu.major || "-"} />
            </Form.Item>
            <Form.Item label="Degree" style={{ marginBottom: "0px" }}>
              <Input disabled value={edu.degree || "-"} />
            </Form.Item>
            <Form.Item label="Duration" style={{ marginBottom: "0px" }}>
              <Input disabled value={`${formatDate(edu.start_date)} - ${formatDate(edu.end_date) || "Present"}`} />
            </Form.Item>
          </div>
        ))}
      </Form>

      {/* Experience */}
      <div className="flex items-center mb-6 mt-6">
        <img src={ExperienceIcon} alt="Experience Icon" className="w-12" />
        <Text className="text-xl font-semibold ml-4">Experience</Text>
      </div>
      <Form layout="vertical" requiredMark={false} size="large">
        {(!jobSeekerData.experience || jobSeekerData.experience.length === 0) ? (
          <Text className="text-gray-400 italic">No experience available</Text>
        ) : jobSeekerData.experience.map((exp, index) => (
          <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6 p-6 border rounded-xl bg-gray-50/30">
            <Form.Item label="Experience Title" style={{ marginBottom: "0px" }}>
              <Input disabled value={exp.experience_title || "-"} />
            </Form.Item>
            <Form.Item label="Company Name" style={{ marginBottom: "0px" }}>
              <Input disabled value={exp.company_name || "-"} />
            </Form.Item>
            <Form.Item label="Employment Type" style={{ marginBottom: "0px" }}>
              <Input disabled value={exp.employment_type || "-"} />
            </Form.Item>
            <Form.Item label="Duration" style={{ marginBottom: "0px" }}>
              <Input disabled value={`${formatDate(exp.start_date)} - ${formatDate(exp.end_date)}`} />
            </Form.Item>
            <Form.Item label="Location" style={{ marginBottom: "0px" }}>
              <Input disabled value={exp.location || "-"} />
            </Form.Item>
            <Form.Item label="Location Type" style={{ marginBottom: "0px" }}>
              <Input disabled value={exp.location_type || "-"} />
            </Form.Item>
            <Form.Item label="Description" style={{ marginBottom: "0px" }}>
              <Input.TextArea disabled value={exp.description || "-"} style={{ height: "96px" }} />
            </Form.Item>
          </div>
        ))}
      </Form>

      {/* Skills */}
      <div className="flex items-center mb-6 mt-6">
        <img src={SkillIcon} alt="Skill Icon" className="w-12" />
        <Text className="text-xl font-semibold ml-4">Skill</Text>
      </div>
      <Form layout="vertical" requiredMark={false} size="large">
        <div className="flex flex-wrap gap-3">
          {(!jobSeekerData.skill || jobSeekerData.skill.length === 0) ? (
            <Text className="text-gray-400 italic">No skill available</Text>
          ) : jobSeekerData.skill.map((skill, index) => (
            <Input key={index} disabled value={skill.skill_name} style={{ width: "auto" }} />
          ))}
        </div>
      </Form>

      {/* Project */}
      <div className="flex items-center mb-6 mt-6">
        <img src={ProjectIcon} alt="Project Icon" className="w-12" />
        <Text className="text-xl font-semibold ml-4">Project</Text>
      </div>
      <Form layout="vertical" requiredMark={false} size="large">
        {(!jobSeekerData.project || jobSeekerData.project.length === 0) ? (
          <Text className="text-gray-400 italic">No projects available</Text>
        ) : jobSeekerData.project.map((proj, index) => (
          <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6 p-6 border rounded-xl bg-gray-50/30">
            <Form.Item label="Project Name" style={{ marginBottom: "0px" }}>
              <Input disabled value={proj.project_name || "-"} />
            </Form.Item>
            <Form.Item label="Duration" style={{ marginBottom: "0px" }}>
              <Input disabled value={`${formatDate(proj.start_date)} - ${formatDate(proj.end_date)}`} />
            </Form.Item>
            <Form.Item label="Description" style={{ marginBottom: "0px" }}>
              <Input.TextArea disabled value={proj.description || "-"} style={{ height: "96px" }} />
            </Form.Item>
          </div>
        ))}
      </Form>

      {/* Certifications and Licences */}
      <div className="flex items-center mb-6 mt-6">
        <img src={CertificationIcon} alt="Certification Icon" className="w-12" />
        <Text className="text-xl font-semibold ml-4">Certifications and Licences</Text>
      </div>
      <Form layout="vertical" requiredMark={false} size="large">
        {(!jobSeekerData.certification || jobSeekerData.certification.length === 0) ? (
          <Text className="text-gray-400 italic">No certifications available</Text>
        ) : jobSeekerData.certification.map((cert, index) => (
          <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6 p-6 border rounded-xl bg-gray-50/30">
            <Form.Item label="Certification Name" style={{ marginBottom: "0px" }}>
              <Input disabled value={cert.certification_name || "-"} />
            </Form.Item>
            <Form.Item label="Issuing Organization" style={{ marginBottom: "0px" }}>
              <Input disabled value={cert.issuing_organization || "-"} />
            </Form.Item>
            <Form.Item label="Duration" style={{ marginBottom: "0px" }}>
              <Input disabled value={`${formatDate(cert.issue_date)} - ${formatDate(cert.expiration_date)}`} />
            </Form.Item>
            <Form.Item label="Credential URL" style={{ marginBottom: "0px" }}>
              <Input disabled value={cert.credential_url || "-"} />
            </Form.Item>
          </div>
        ))}
      </Form>

      {/* Language */}
      <div className="flex items-center mb-6 mt-6">
        <img src={LanguageIcon} alt="Language Icon" className="w-12" />
        <Text className="text-xl font-semibold ml-4">Language</Text>
      </div>
      <Form layout="vertical" requiredMark={false} size="large">
        <div className="flex flex-wrap gap-3">
          {(!jobSeekerData.language || jobSeekerData.language.length === 0) ? (
            <Text className="text-gray-400 italic">No language available</Text>
          ) : jobSeekerData.language.map((lang, index) => (
            <Input key={index} disabled value={lang.language_name} style={{ width: "auto" }} />
          ))}
        </div>
      </Form>

      <div className="flex justify-end mt-10 border-t pt-6">
        <Button
          type="primary"
          style={{ width: 120, height: 40, borderRadius: 12 }}
          onClick={handleBack}
        >
          <span className="font-medium text-sm">Back</span>
        </Button>
      </div>
    </div>
  );
};

export default ShowApplicants;
