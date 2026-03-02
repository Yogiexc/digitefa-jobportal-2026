import { useEffect, useState } from "react";
import { Button, Typography, Image, Upload } from "antd";
import Api from "../../services/Api";
import PersonalInformationIcon from "../../assets/svg/Personal.svg";
import PersonalSummaryIcon from "../../assets/svg/PersonalSummary.svg";
import EducationIcon from "../../assets/svg/Education.svg";
import CertificationIcon from "../../assets/svg/Certification.svg";
import ExperienceIcon from "../../assets/svg/Experience.svg";
import SkillIcon from "../../assets/svg/Skills.svg";
import ProjectIcon from "../../assets/svg/Project.svg";
import LanguageIcon from "../../assets/svg/Language.svg";

const { Text } = Typography;

const ShowApplicants = ({ onBack, applicantsId }) => {
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [jobSeekerData, setJobSeekerData] = useState("");
  

  useEffect(() => {
    const fetchJobSeekerDetails = () => {
      Api.get(`/jobs/applicants/detail/${applicantsId}`)
        .then((response) => {
          if (response && response.data) {
            const data = response.data;
            const profilePictureUrl = data.profile_picture_url
              ? `http://localhost:3000/${data.profile_picture_url.replace(
                  /\\/g,
                  "/"
                )}`
              : null;

              setJobSeekerData({
                full_name: data.job_seeker.full_name,
                phone_number: data.personal_info.phone_number,
                email: data.job_seeker.email,
                date_of_birth: data.personal_info.date_of_birth,
                address: data.personal_info.address,
                personal_summary: data.personal_summary,
                education: data.education, 
                experience: data.experiences,
                skill: data.skills, 
                project: data.projects, 
                certification: data.certifications, 
                language: data.languages, 
              });
    
            if (profilePictureUrl) {
              setFileList([
                {
                  uid: "-1",
                  name: "profile-picture.png",
                  status: "done",
                  url: profilePictureUrl,
                },
              ]);
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
  }, [applicantsId]);
 
  const handleBack = () => {
    onBack();
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const renderPersonalInformation = () => {
    return (
      <div className="mb-2">
        <Upload
          listType="picture-circle"
          fileList={fileList}
          onPreview={handlePreview}
        ></Upload>
        {previewImage && (
          <Image
            wrapperStyle={{
              display: "none",
            }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
        <Text className="font-medium text-xl">
          {jobSeekerData.full_name}
        </Text>
        <br />
        <Text>{jobSeekerData.phone_number}</Text>
        <br />
        <Text>{jobSeekerData.email}</Text>
        <br />
        <Text className="text-xs">
          {new Date(jobSeekerData.date_of_birth).toLocaleDateString("in-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Text>
        <div className="mb-6" />
        <Text className="text-xs">{jobSeekerData.address}</Text>
      </div>
    );
  };

  const renderEducation = (education) => {
    if (!Array.isArray(education) || education.length === 0) {
      return <Text>No education available</Text>;
    }

    const formatDate = (date) => {
      if (!date) return "";
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    };

    return (
      <div className="mb-2">
        <Text>
          {education.university_name} - {education.major}
        </Text>
        <br />
        <Text className="text-xs">{education.degree}</Text>
        <div className="mb-6" />
        <Text className="text-xs">
          {formatDate(education.start_date)} - {formatDate(education.end_date)}
        </Text>
      </div>
    );
  };

  const renderSkills = (skills) => {
    if (!Array.isArray(skills) || skills.length === 0) {
      return <Text>No skill available</Text>;
    }

    return skills.map((skill, index) => (
      <div key={index} className="mb-2 p-2 border rounded-lg">
        <Text>{skill.skill_name}</Text>
      </div>
    ));
  };

  const renderProjects = (projects) => {
    if (!Array.isArray(projects) || projects.length === 0) {
      return <Text>No Projects Available</Text>;
    }

    const formatDate = (date) => {
      if (!date) return "";
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    };

    return projects.map((projects, index) => (
      <div
        key={index}
        className="mb-6 p-4 border rounded-xl">
        <Text className="font-medium text-xl">
          {projects.project_name}
        </Text>
        <br />
        <Text className="text-xs">
          {formatDate(projects.start_date)} - {formatDate(projects.end_date)}
        </Text>
        <div className="mb-6" />
        <Text>{projects.description}</Text>
      </div>
    ));
  };

  const renderCertifications = (certifications) => {
    if (!Array.isArray(certifications) || certifications.length === 0) {
      return <Text>No Certifications Available</Text>;
    }

    const formatDate = (date) => {
      if (!date) return "";
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    };

    return certifications.map((certifications, index) => (
      <div key={index} className="mb-6 p-4 border rounded-lg" style={{ borderRadius: "12px" }}>
        <Text className="font-medium text-xl">
          {certifications.certification_name}
        </Text>

        <br />
        <Text>{certifications.issuing_organization}</Text>
        <br />
        <Text className="text-xs">
          {formatDate(certifications.issue_date)} -
          {formatDate(certifications.expiration_date)}
        </Text>
        <div className="mb-6" />
        <Text>{certifications.credential_url}</Text>
      </div>
    ));
  };

  const renderExperience = (experiences) => {
    if (!Array.isArray(experiences) || experiences.length === 0) {
      return <Text>No Experience Available</Text>;
    }

    const formatDate = (date) => {
      if (!date) return "";
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    };

    return experiences.map((experiences, index) => (
      <div key={index} className="mb-6 p-4 border rounded-lg" style={{ borderRadius: "12px" }}>
        <Text className="font-medium text-xl">
          {experiences.experience_title}
        </Text>
        <br />
        <Text>
          {experiences.company_name} • {experiences.employment_type}
        </Text>
        <br />
        <Text className="text-xs">
        {formatDate(experiences.start_date)} -
        {formatDate(experiences.end_date)}
        </Text>
        <br />
        <Text className="text-xs">
          {experiences.location} • {experiences.location_type}
        </Text>
        <div className="mb-6" />
        <Text>{experiences.description}</Text>
      </div>
    ));
  };

  const renderLanguages = (languages) => {
    if (!Array.isArray(languages) || languages.length === 0) {
      return <Text>No languages available</Text>;
    }

    return languages.map((lang, index) => (
      <div key={index} className="mb-3 p-2 border rounded-lg">
        <Text>{lang.language_name}</Text>
      </div>
    ));
  };

  const Section = ({ icon, title, content }) => (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <img src={icon} alt={title} className="w-12" />
        <Text className="text-xl font-semibold ml-4">{title}</Text>
      </div>
      <div
        className="border p-4 rounded-lg"
        style={{ borderRadius: "12px", maxWidth: "500px", height: "auto" }}
      >
        {Array.isArray(content) ? content : <Text>{content}</Text>}
      </div>
    </div>
  );

  return (
    <div className="bg-white shadow rounded-[20px] p-8">
      <Section
        icon={PersonalInformationIcon}
        title="Personal Information"
        content={renderPersonalInformation()}
      />
      <Section
        icon={PersonalSummaryIcon}
        title="Personal Summary"
        content={jobSeekerData.personal_summary}
      />
      <Section
        icon={EducationIcon}
        title="Educational Information"
        content={renderEducation(jobSeekerData.education)}
      />
      <Section
        icon={ExperienceIcon}
        title="Experience"
        content={renderExperience(jobSeekerData.experience)}
      />
      <Section
        icon={SkillIcon}
        title="Skill"
        content={renderSkills(jobSeekerData.skill)}
      />
      <Section
        icon={ProjectIcon}
        title="Project"
        content={renderProjects(jobSeekerData.project)}
      />
      <Section
        icon={CertificationIcon}
        title="Certifications and Licences"
        content={renderCertifications(jobSeekerData.certification)}
      />
      <Section
        icon={LanguageIcon}
        title="Language"
        content={renderLanguages(jobSeekerData.language)}
      />

      <div className="flex justify-end mt-6">
        <Button
          type="primary"
          style={{width: 120, height: 40, borderRadius: 12}}
          onClick={handleBack}
        >
          <span className="font-medium text-sm">Back</span>
        </Button>
      </div>
    </div>
  );
};

export default ShowApplicants;
