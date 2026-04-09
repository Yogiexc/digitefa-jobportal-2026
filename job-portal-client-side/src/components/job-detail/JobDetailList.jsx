import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookmarkIcon,
  ChevronRightIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  CursorArrowRippleIcon,
  WifiIcon,
  MapPinIcon,
  ClockIcon,
  ComputerDesktopIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { Spin, Button, message } from "antd";
import Api from "../../services/Api";
import NotFoundIcon from "../../assets/images/404.png";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import JobFallback from "../../assets/images/job.jpg";

const getEmploymentTypeIcon = (employmentType) => {
  switch (employmentType) {
    case "Full Time":
      return (
        <BriefcaseIcon className="size-4 mr-2" style={{ color: "#2E7D32" }} />
      );
    case "Freelance":
      return (
        <ComputerDesktopIcon
          className="size-4 mr-2"
          style={{ color: "#2E7D32" }}
        />
      );
    case "Internship":
      return <ClockIcon className="size-4 mr-2" style={{ color: "#2E7D32" }} />;
    default:
      return null;
  }
};

const getWorkTypeIcon = (workType) => {
  switch (workType) {
    case "Remote":
      return <WifiIcon className="size-4 mr-2" style={{ color: "#2E7D32" }} />;
    case "Hybrid":
      return (
        <CursorArrowRippleIcon
          className="size-4 mr-2"
          style={{ color: "#2E7D32" }}
        />
      );
    case "On Site":
      return (
        <MapPinIcon className="size-4 mr-2" style={{ color: "#2E7D32" }} />
      );
    default:
      return null;
  }
};

const calculateDaysAgo = (published_at) => {
  const publishedDate = new Date(published_at);
  const currentDate = new Date();
  const differenceInTime = currentDate - publishedDate;
  const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
  return differenceInDays;
};

const JobDetailList = ({ jobId }) => {
  const [loading, setLoading] = useState(true);
  const [jobData, setJobData] = useState(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_IMAGE_API;

  const userData = JSON.parse(localStorage.getItem("userData"));

  const [shouldRefetch, setShouldRefetch] = useState(false);

  const handleBookmarkClick = useCallback((job_id, is_saved) => {
    if (!userData) {
      message.destroy();
      message.error("Please login to save job");
      navigate("/login");
      return;
    } else {
      if (!is_saved) {
        Api.post(`/jobs/${job_id}/save`)
          .then(() => {
            message.destroy();
            message.success("Job saved successfully");
            setShouldRefetch((prev) => !prev);
          })
          .catch((error) => {
            message.destroy();
            message.error("Failed to save job");
            console.error("Error saving job:", error);
          });
      } else {
        Api.post(`/jobs/${job_id}/unsave`)
          .then(() => {
            message.destroy();
            message.success("Job removed from saved list");
            setShouldRefetch((prev) => !prev);
          })
          .catch((error) => {
            message.destroy();
            message.error("Failed to remove job from saved list");
            console.error("Error removing job from saved list:", error);
          });
      }
    }
  }, []);

  const fetchData = (jobId) => {
    Api.get(`/jobs-search/${jobId}`)
      .then((response) => {
        const jobDetail = response.data;
        setJobData(jobDetail);
      })
      .catch((error) => {
        console.error("Error fetching job detail data", error);
      })
      .finally(() => setLoading(false));
  };

  const handleApplyJob = (job_id) => {
    if (!userData) {
      message.destroy();
      message.error("Please login to apply job");
      navigate("/login");
      return;
    } else {
      navigate(`/jobs/${job_id}/apply`);
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchData(jobId);
    }
  }, [jobId, shouldRefetch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!jobData) {
    return (
      <div className="flex flex-col items-center min-h-screen text-center">
        <div className="flex items-center">
          <img
            src={NotFoundIcon}
            alt="404"
            className="w-[300px] h-[230px] mb-10"
          />
        </div>
        <h1 className="text-2xl font-semibold mb-5">Page Not Found</h1>
        <p className="text-base text-[#9A9A9A] mb-5 max-w-2xl">
          {`Sorry, the page you're looking for doesn't exist. It might have been
          removed, had its name changed, or is temporarily unavailable. Please
          check the URL or return to the homepage.`}
        </p>
        <Button
          type="primary"
          style={{ width: 650, height: 40, borderRadius: 12 }}
          onClick={() => navigate("/")}
        >
          <span className="font-medium"> Back to Homepage </span>
        </Button>
      </div>
    );
  }

  const renderDescription = (description) => {
    const formattedDescription = description.split("\n").map((item, index) => (
      <li key={index} className="text-xs ml-5">
        {item}
      </li>
    ));

    return <ul className="text-[#232323] space-y-2">{formattedDescription}</ul>;
  };

  return (
    <div className="p-4 md:p-16 bg-white">
      <div className="flex flex-col md:flex-row justify-between items-start bg-white p-4 md:p-8 rounded-[20px] shadow-lg">
        <div className="md:w-3/4">
          <div className="flex md:flex-row items-center">
            <img
              src={jobData?.company?.logo_url ? `${API_URL}/${jobData.company.logo_url}` : JobFallback}
              alt="Company Logo"
              onError={(e) => { e.target.onerror = null; e.target.src = JobFallback; }}
              className="w-20 h-auto md:w-24 md:h-auto mr-4"
            />
            <div>
              <h1 className="text-base md:text-xl font-semibold">
                {jobData?.title}
              </h1>
            </div>
          </div>
          <div className="flex flex-col mt-4">
            <p className="text-[13px] text-[#232323]">
              {jobData?.company?.legal_name}
            </p>
            <p className="text-[13px] text-[#232323]">{jobData?.location}</p>
          </div>

          <div className="mt-6 md:mt-8">
            <h2 className="text-sm font-medium mb-6">Job Description</h2>
            {renderDescription(jobData?.description)}
          </div>

          <div className="mt-6 md:mt-8">
            <h2 className="text-sm font-medium mb-6">Job Benefits</h2>
            <ul className="text-xs list-disc pl-8 text-[#232323] space-y-2">
              {jobData?.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>

          <div
            className="mt-6 md:mt-8 md:w-[560px] w-[330px] h-auto p-4 pr-6 rounded-2xl"
            style={{
              border: "1px solid #0C6937",
              borderRadius: "12px",
              boxSizing: "border-box",
            }}
          >
            <div className="flex justify-between">
              <h3 className="text-sm font-medium">
                About {jobData?.company?.legal_name}
              </h3>
              <span
                className="flex items-center text-xs text-[#06A73B] font-medium cursor-pointer"
                onClick={() => {
                  navigate(`/company/${jobData?.company?.company_id}`);
                }}
              >
                Read More <ChevronRightIcon className="size-4 ml-2" />
              </span>
            </div>
            <p className="text-[13px] text-[#232323] mt-4">Finance</p>
            <p className="text-[13px] text-[#232323] mb-4">
              {jobData?.company?.province}, {jobData?.company?.country}
            </p>
            <p className="text-xs text-[#232323] break-words">
              {jobData?.company?.description?.length > 250
                ? `${jobData.company.description.substring(0, 250)}...`
                : jobData?.company?.description}
            </p>
          </div>
        </div>

        <div className="md:w-[430px] md:h-auto w-[330px] bg-[#F9FBFF] p-4 md:p-6 rounded-2xl shadow-md mt-6 md:mt-0">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[#232323] text-sm font-medium">Apply Now</h3>
            <h3 className="text-[#A0A0A0] text-xs">
              {calculateDaysAgo(jobData?.published_at) === 0
                ? "Posted today"
                : `${calculateDaysAgo(jobData?.published_at)} days ago`}
            </h3>
          </div>

          <div className="flex space-x-8 mb-6">
            <Button
              type="primary"
              style={{
                width: 300,
                height: 40,
                borderRadius: 12,
                backgroundColor: jobData.is_applied ? "#BBBBBB" : "#06A73B",
                color: jobData.is_applied ? "black" : "white",
              }}
              onClick={() => {
                if (jobData.is_applied) {
                  //
                } else {
                  handleApplyJob(jobData.job_id);
                }
              }}
            >
              <span className="text-xs font-medium">
                {" "}
                {jobData?.application_status === 'waiting_interview'
                  ? 'Interview Scheduled'
                  : jobData?.is_applied
                  ? "Applied"
                  : "Apply"}{" "}
              </span>
            </Button>
            <Button
              style={{
                borderRadius: 12,
                backgroundColor: jobData.is_saved ? "green" : "transparent",
                width: 46,
                height: 40,
              }}
              onClick={() =>
                handleBookmarkClick(jobData?.job_id, jobData?.is_saved)
              }
            >
              <BookmarkIcon
                className="size-[14px]"
                style={{ color: jobData?.is_saved ? "white" : "black" }}
              />
            </Button>
          </div>


          {jobData?.is_applied && jobData?.application_status && (
            <div className="mb-6 flex flex-col gap-2">
              <h3 className="text-sm font-medium text-[#232323]">
                Application Status
              </h3>
              <div 
                className={`flex items-center justify-center p-2 rounded-xl text-xs font-semibold ${
                  jobData.application_status === 'pending' ? 'bg-blue-100 text-blue-700' :
                  jobData.application_status === 'waiting_interview' ? 'bg-yellow-100 text-yellow-700' :
                  jobData.application_status === 'accepted' ? 'bg-green-100 text-green-700' :
                  jobData.application_status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}
              >
                {jobData.application_status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </div>
              {jobData.application_status === 'waiting_interview' && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <p className="text-xs text-yellow-800">
                    <span className="font-semibold text-yellow-900">Note: </span> 
                    Please check your email regularly. We have sent or will be sending you an interview invitation and further instructions.
                  </p>
                </div>
              )}

            </div>
          )}

          {jobData?.recommendation?.matched_job === true && (
            <div className="items-center gap-2 p-3 mb-6 rounded-[12px] bg-[#E3FCEC] text-green-700">
              <div className="flex items-center justify-start gap-2">
                <CheckBadgeIcon width={30} className="text-green-600" />
                <div className="text-base font-semibold">
                  This Job Matches Your{" "}
                  {jobData?.recommendation?.matched_section}
                </div>
              </div>
              <div className="mt-1">
                {jobData?.recommendation?.match_description}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-sm font-medium text-[#232323] mb-4">
              Job Information
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="bg-[#E3FCEC] text-[#2E7D32] text-xs font-medium rounded-[12px] p-2 flex items-center">
                <InformationCircleIcon
                  className="size-[14px] mr-2"
                  style={{ color: "#2E7D32" }}
                />
                {jobData?.category}
              </span>
              <span className="bg-[#E3FCEC] text-[#2E7D32] text-xs font-medium rounded-[12px] p-2 flex items-center">
                {getEmploymentTypeIcon(jobData?.employment_type)}
                {jobData?.employment_type}
              </span>
              <span className="bg-[#E3FCEC] text-[#2E7D32] text-xs font-medium rounded-[12px] p-2 flex items-center">
                {getWorkTypeIcon(jobData?.work_type)}
                {jobData?.work_type}
              </span>
              <span className="bg-[#E0F7FA] text-[#00796B] text-xs font-medium rounded-[12px] p-2 flex items-center">
                <CurrencyDollarIcon
                  className="size-[14px] mr-2"
                  style={{ color: "#00796B" }}
                />
                {jobData?.minimum_salary > 0
                  ? `Rp ${jobData?.minimum_salary.toLocaleString()} - Rp ${jobData?.maximum_salary.toLocaleString()}`
                  : "Salary Undisclosed"}
              </span>
            </div>
          </div>

          {jobData?.is_applied && (
            <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-xs text-yellow-800">
                Note: All updates regarding your application will be sent via email. Please ensure that you regularly check your inbox.
              </p>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-sm font-medium text-[#232323] mb-4">
              Job Requirement
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="bg-[#E4E4E4] text-[#232323] text-xs font-medium rounded-[12px] p-2 h-[40px] w-auto flex items-center">
                {jobData?.experience_requirement}
              </span>
              <span className="bg-[#E4E4E4] text-[#232323] text-xs font-medium rounded-[12px] p-2 h-[40px] w-auto flex items-center">
                {jobData?.education_requirement}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-[#232323] mb-4">
              Skills Requirement
            </h3>
            <div className="flex flex-wrap gap-2">
              {jobData?.skills_requirement?.map((skill, index) => (
                <span
                  key={index}
                  className="bg-[#E4E4E4] text-[#232323] text-xs font-medium rounded-[12px] p-2 h-[40px] w-auto flex items-center"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailList;
