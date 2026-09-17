import { useState, useEffect, useCallback } from "react";
import { Card, Button, Col, Row, message, Spin } from "antd";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import Api from "../../services/Api";
import { useNavigate } from "react-router-dom";
import JobFallback from "../../assets/images/job.jpg";

const calculateExpiresIn = (expired_at) => {
  if (!expired_at) return "No expiration date";
  const expiredDate = new Date(expired_at);
  const currentDate = new Date();
  const differenceInTime = expiredDate - currentDate;
  
  if (differenceInTime <= 0) return "Expired";
  
  const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
  if (differenceInDays > 0) {
    return `expires in ${differenceInDays} days`;
  }
  
  const differenceInHours = Math.floor(differenceInTime / (1000 * 3600));
  if (differenceInHours > 0) {
    return `expires in ${differenceInHours} hours`;
  }

  const differenceInMinutes = Math.floor(differenceInTime / (1000 * 60));
  return `expires in ${differenceInMinutes} minutes`;
};

const JobApplicationHistoryList = () => {
  const [jobs, setJobs] = useState([]);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_IMAGE_API;
  const [loading, setLoading] = useState(true);
  const userData = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    Api.get("/applied-jobs", {
      params: {
        page: 1,
        pageSize: 8,
      },
    })
      .then((response) => {
        const jobsData = response.data;
        setJobs(jobsData);
      })
      .catch((error) => {
        console.error("Error fetching saved jobs:", error);
        message.error("Failed to load saved jobs");
      })
      .finally(setLoading(false));
  }, [shouldRefetch]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin />
      </div>
    );
  }

  return (
    <div className="py-8 md:px-12">
      <div className="container mx-auto">
        <Card className="relative rounded-[20px] shadow-lg ">
          {jobs.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg font-medium text-gray-500">
                No jobs saved.
              </p>
            </div>
          ) : (
            <>
              <Row gutter={[16, 48]} justify="center">
                {jobs.map((job, index) => (
                  <Col key={index} xs={24} sm={12} md={12}>
                    <Card className="relative rounded-2xl border-[#D8D8D8]">
                      <div className="flex justify-between items-start">
                        <img
                          src={job.company.logo_url ? `${API_URL}/${job.company.logo_url}` : JobFallback}
                          alt="Job Icon"
                          onError={(e) => { e.target.onerror = null; e.target.src = JobFallback; }}
                          className="w-16 h-16 object-cover rounded-full"
                        />
                        <div className="flex flex-col">
                          <h3 className="text-[15px] font-semibold">
                            {job.job.title}
                          </h3>
                          <p className="text-[13px] text-black">
                            {job.company.legal_name}
                          </p>
                          <p className="text-[13px] text-black">
                            {job.company.city}, {job.company.country}
                          </p>
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
                            handleBookmarkClick(
                              index,
                              job.job.job_id,
                              job.is_saved
                            )
                          }
                        >
                          <BookmarkIcon
                            className="size-[14px]"
                            style={{ color: job.is_saved ? "white" : "black" }}
                          />
                        </Button>
                      </div>

                      <div className="relative flex justify-end items-start mt-8 space-x-2">
                        <div
                          style={{
                            padding: "0 12px",
                            height: "35px",
                            backgroundColor: job.status === 'Accepted' ? '#dcfce7' : job.status === 'Rejected' ? '#fee2e2' : job.status === 'Interviewing' ? '#f3e8ff' : job.status === 'Screening' ? '#dbeafe' : '#fef3c7',
                            color: job.status === 'Accepted' ? '#166534' : job.status === 'Rejected' ? '#991b1b' : job.status === 'Interviewing' ? '#6b21a8' : job.status === 'Screening' ? '#1e40af' : '#92400e',
                            borderRadius: "12px",
                          }}
                          className="flex items-center justify-center font-medium text-xs whitespace-nowrap"
                        >
                          {job.status}
                        </div>
                        <div
                          style={{
                            width: "210px",
                            height: "35px",
                            backgroundColor: "#F4F4F4",
                            borderRadius: "12px",
                          }}
                          className="flex items-center justify-center"
                        >
                          <span className="text-xs font-medium ">
                            Applied at{" "}
                            {new Date(job.applied_at).toLocaleDateString(
                              "en-US",
                              { day: "2-digit", month: "long", year: "numeric" }
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <span className="text-xs text-[#232323]">
                          {calculateExpiresIn(job.job?.expired_at)}
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
                                navigate(`/jobs/${job.job.job_id}`);
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
                              backgroundColor: job.is_applied
                                ? "#BBBBBB"
                                : "#06A73B",
                              color: job.is_applied ? "black" : "white",
                            }}
                          >
                            <span className="text-[12px] font-medium">
                              {job.is_applied ? "Applied" : "Apply"}
                            </span>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default JobApplicationHistoryList;
