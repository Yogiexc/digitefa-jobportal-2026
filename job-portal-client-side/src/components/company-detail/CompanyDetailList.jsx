import { Card, Col, Row, Button, Spin, message } from "antd";
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import InstagramIcon from "../../assets/svg/Instagram.svg";
import YoutubeIcon from "../../assets/svg/Youtube.svg";
import FacebookIcon from "../../assets/svg/Facebook.svg";
import TwitterIcon from "../../assets/svg/Twitter.svg";
import JobFallback from "../../assets/images/job.jpg";
import Api from "../../services/Api";
import PagesNotFound from "../../pages/PagesNotFound";

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

const CompanyDetailList = ({ companyId }) => {
  const [loading, setLoading] = useState(true);
  const [companyData, setCompanyData] = useState(null);
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

  const fetchData = (companyId) => {
    Api.get(`/jobs-search/company/${companyId}`)
      .then((response) => {
        const companyDetail = response.data;
        setCompanyData(companyDetail);
      })
      .catch((error) => {
        console.error("Error fetching job detail data", error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (companyId) {
      fetchData(companyId);
    }
  }, [companyId, shouldRefetch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!companyData) {
    return <PagesNotFound />;
  }

  return (
    <div className="py-4 md:px-12 bg-white">
      <div className="container mx-auto">
        <Card className="relative rounded-[20px] shadow-lg ">
          <Row gutter={[24, 12]}>
            <Col xs={24} md={8} className="flex flex-col">
              <div className="ml-6">
                <img
                  src={companyData.logo_url ? `${API_URL}/${companyData.logo_url}` : JobFallback}
                  alt="Company Logo"
                  onError={(e) => { e.target.onerror = null; e.target.src = JobFallback; }}
                  className="w-24 h-24 mb-4 border border-[#BBBBBB] rounded-[20px] p-4 "
                />
                <h3 className="text-xl font-semibold">
                  {companyData.legal_name}
                </h3>
                <p className="text-xs mb-4"> {companyData.category} </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <img
                      src={InstagramIcon}
                      alt="Instagram Logo"
                      className="mr-3"
                    />
                    <Link
                      to={`https://instagram.com/${companyData.instagram_url}`}
                      target="_blank"
                    >
                      {" "}
                      {companyData.instagram_url}
                    </Link>
                  </div>
                  <div className="flex items-center">
                    <img
                      src={YoutubeIcon}
                      alt="Youtube Logo"
                      className="mr-3"
                    />
                    <Link
                      to={`https://youtube.com/@${companyData.youtube_url}`}
                      target="_blank"
                    >
                      {" "}
                      {companyData.youtube_url}
                    </Link>
                  </div>
                  <div className="flex items-center">
                    <img
                      src={FacebookIcon}
                      alt="Facebook Logo"
                      className="mr-3"
                    />
                    <Link
                      to={`https://facebook.com/${companyData.facebook_url}`}
                      target="_blank"
                    >
                      {" "}
                      {companyData.facebook_url}
                    </Link>
                  </div>
                  <div className="flex items-center">
                    <img
                      src={TwitterIcon}
                      alt="Twitter Logo"
                      className="mr-3"
                    />
                    <Link
                      to={`https://twitter.com/${companyData.twitter_url}`}
                      target="_blank"
                    >
                      {" "}
                      {companyData.twitter_url}
                    </Link>
                  </div>
                </div>
                <Link to={companyData.website} target="_blank">
                  <Button
                    style={{
                      width: 180,
                      height: 40,
                      borderRadius: 12,
                      marginTop: 16,
                      borderColor: "#BBB",
                    }}
                    icon={<ArrowRightStartOnRectangleIcon className="size-4" />}
                  >
                    <span className="text-xs"> Offical Website </span>
                  </Button>
                </Link>
              </div>
            </Col>

            <Col xs={24} md={16}>
              <div
                className="w-full h-auto p-4 rounded-2xl"
                style={{
                  border: "1px solid #0C6937",
                  borderRadius: "12px",
                  boxSizing: "border-box",
                }}
              >
                <h3 className="text-base font-semibold">Company Overview</h3>
                <p className="mt-2 text-xs">{companyData.description}</p>
              </div>
            </Col>
          </Row>
          <div className="mt-8">
            <h3 className="text-base font-semibold mb-6 ml-6">
              List of Job Vacancies
            </h3>
            <Row gutter={[16, 16]} justify="center">
              {companyData.jobs.map((job, index) => (
                <Col key={job.job_id} xs={24} sm={12} md={8}>
                  <Card className="relative rounded-2xl border-[#D8D8D8]">
                    <div className="flex justify-between items-start">
                      <img
                        src={companyData.logo_url ? `${API_URL}/${companyData.logo_url}` : JobFallback}
                        alt="Company Logo"
                        onError={(e) => { e.target.onerror = null; e.target.src = JobFallback; }}
                        className="w-24"
                      />
                      <div className="flex flex-col">
                        <h3 className="text-[15px] font-semibold">
                          {job.title}
                        </h3>
                        <p className="text-[13px] text-black">
                          {job.legal_name}
                        </p>
                        <p className="text-[13px] text-black">{job.location}</p>
                      </div>
                      <Button
                        style={{
                          borderRadius: 12,
                          backgroundColor: job.is_saved
                            ? "green"
                            : "transparent",
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
                        <span className="bg-[#E3FCEC] text-[#2E7D32] text-[12px] font-medium rounded-[12px] p-2 flex items-center">
                          {getEmploymentTypeIcon(job.employment_type)}
                          {job.employment_type}
                        </span>
                        <span className="bg-[#E3FCEC] text-[#2E7D32] text-[12px] font-medium rounded-[12px] p-2 flex items-center">
                          {getWorkTypeIcon(job.work_type)}
                          {job.work_type}
                        </span>
                        <span className="bg-[#E3FCEC] text-[#2E7D32] text-[12px] font-medium rounded-[12px] p-2 flex items-center">
                          <PresentationChartBarIcon
                            className="size-[14px] mr-2"
                            style={{ color: "#2E7D32" }}
                          />
                          {job.experience_requirement}
                        </span>
                        <span className="bg-[#E0F7FA] text-[#00796B] text-[12px] font-medium rounded-[12px] p-2 flex items-center">
                          <CurrencyDollarIcon
                            className="size-[14px] mr-2"
                            style={{ color: "#00796B" }}
                          />
                          {job.minimum_salary > 0
                            ? `Rp ${job.minimum_salary.toLocaleString()} - Rp ${job.maximum_salary.toLocaleString()}`
                            : "Salary Undisclosed"}
                        </span>
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
                          >
                            <span
                              className="text-[12px] font-medium"
                              onClick={() => {
                                navigate(`/jobs/${job.job_id}`);
                              }}
                            >
                              View Detail
                            </span>
                          </Button>
                          <Button
                            style={{
                              borderRadius: 12,
                              height: 40,
                              width: 100,
                              backgroundColor: "#06A73B",
                              color: "white",
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
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CompanyDetailList;
