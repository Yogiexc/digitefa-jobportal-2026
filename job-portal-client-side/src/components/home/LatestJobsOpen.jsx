import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Col, Row, message } from "antd";
import {
  BriefcaseIcon,
  BookmarkIcon,
  CurrencyDollarIcon,
  CursorArrowRippleIcon,
  WifiIcon,
  MapPinIcon,
  PresentationChartBarIcon,
  ClockIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import Api from "../../services/Api";

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

const LatestJobsOpen = () => {
  const [jobs, setJobs] = useState([]);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_IMAGE_API;

  const userData = JSON.parse(localStorage.getItem("userData"));

  const handleBookmarkClick = useCallback((index, job_id, is_saved) => {
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
    Api.get("/jobs-search?pageSize=6&sortBy=most_recent")
      .then((response) => {
        const data = response.data;
        setJobs(data);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
      });
  }, [shouldRefetch]);

  return (
    <div className="py-24 px-2 md:px-16 bg-white-400">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-[48px] font-medium">
            Latest Jobs Open
          </h2>
        </div>
        <Row gutter={[16, 16]} justify="center">
          {jobs.map((job, index) => (
            <Col key={job.job_id} xs={24} sm={12} md={8}>
              <Card className="relative rounded-2xl border-[#D8D8D8]">
                <div className="flex justify-between items-start">
                  <div className="flex gap-6">
                    <img
                      src={`${API_URL}/${job.company.logo_url}`}
                      alt="Job Icon"
                      className="w-16 h-16 object-cover rounded-full"
                    />
                    <div className="flex flex-col">
                      <h3 className="text-[15px] font-semibold">{job.title}</h3>
                      <p className="text-[13px] text-black">
                        {job.company.legal_name}
                      </p>
                      <p className="text-[13px] text-black">{job.location}</p>
                    </div>
                  </div>
                  <Button
                    style={{
                      borderRadius: 12,
                      backgroundColor: job.is_saved ? "green" : "transparent",
                      width: 46,
                      height: 40,
                    }}
                    onClick={() =>
                      handleBookmarkClick(index, job.job_id, job.is_saved)
                    }
                  >
                    <BookmarkIcon
                      className="size-[14px]"
                      style={{ color: job.is_saved ? "white" : "black" }}
                    />
                  </Button>
                </div>

                <div className="mt-4">
                  <div className="flex flex-wrap gap-3 mt-4">
                    <badge className="bg-[#E3FCEC] text-[#2E7D32] text-[12px] font-medium rounded-[12px] p-2 flex items-center">
                      {getEmploymentTypeIcon(job.employment_type)}
                      {job.employment_type}
                    </badge>
                    <badge className="bg-[#E3FCEC] text-[#2E7D32] text-[12px] font-medium rounded-[12px] p-2 flex items-center">
                      {getWorkTypeIcon(job.work_type)}
                      {job.work_type}
                    </badge>
                    <badge className="bg-[#E3FCEC] text-[#2E7D32] text-[12px] font-medium rounded-[12px] p-2 flex items-center">
                      <PresentationChartBarIcon
                        className="size-[14px] mr-2"
                        style={{ color: "#2E7D32" }}
                      />
                      {job.experience_requirement}
                    </badge>
                    <badge className="bg-[#E0F7FA] text-[#00796B] text-[12px] font-medium rounded-[12px] p-2 flex items-center">
                      <CurrencyDollarIcon
                        className="size-[14px] mr-2"
                        style={{ color: "#00796B" }}
                      />
                      {job.minimum_salary > 0
                        ? `Rp ${job.minimum_salary.toLocaleString()} - Rp ${job.maximum_salary.toLocaleString()}`
                        : "Salary Undisclosed"}
                    </badge>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-[#232323]">
                      {calculateDaysAgo(job.published_at) === 0
                        ? "Posted today"
                        : `${calculateDaysAgo(job.published_at)} days ago`}
                    </span>
                    <div className="flex space-x-2">
                      <Button
                        style={{
                          borderRadius: 12,
                          height: 40,
                          width: 100,
                          borderColor: "#BBB",
                        }}
                        onClick={() => {
                          navigate(`/jobs/${job.job_id}`);
                        }}
                      >
                        <span className="text-xs font-medium">View Detail</span>
                      </Button>
                      <Button
                        style={{
                          borderRadius: 12,
                          height: 40,
                          width: 100,
                          backgroundColor: "#06A73B",
                          color: "white",
                        }}
                        onClick={() => {
                          handleApplyJob(job.job_id);
                        }}
                      >
                        <span className="text-xs font-medium">Apply</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="text-center mt-16">
          <Button
            style={{ borderRadius: 12, height: 48, borderColor: "#BBB" }}
            onClick={() => {
              navigate("/find-jobs");
            }}
          >
            <span className="text-[#232323] text-[16px] font-medium">
              View All Jobs
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LatestJobsOpen;
