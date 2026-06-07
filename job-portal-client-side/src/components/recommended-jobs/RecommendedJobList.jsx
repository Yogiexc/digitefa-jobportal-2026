import { useState, useEffect, useCallback } from "react";
import { Card, Button, Col, Row, message, Spin } from "antd";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import Api from "../../services/Api";
import { useNavigate } from "react-router-dom";
import JobFallback from "../../assets/images/job.jpg";
import NotFoundIcon from "../../assets/images/404.png";
import PaginationComponent from "../Pagination";

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

const RecommendedJobList = () => {
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_IMAGE_API;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setLoading(true);
    Api.get("/jobs-search?sortBy=most_relevant", {
      params: {
        page: currentPage,
        pageSize: 8,
      },
    })
      .then((response) => {
        const jobsData = response.data;
        setJobs(jobsData);
        setTotalJobs(response.totalData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching saved jobs:", error);
        message.error("Failed to load saved jobs");
        setLoading(false);
      });
  }, [currentPage, shouldRefetch]);

  const handleBookmarkClick = useCallback((index, job_id, is_saved) => {
    if (!is_saved) {
      Api.post(`/jobs/${job_id}/save`)
        .then(() => {
          message.destroy();
          message.success("Job saved successfully");
          setShouldRefetch((prev) => !prev);
        })
        .catch(() => {
          message.destroy();
          message.error("Failed to save job");
        });
    } else {
      Api.post(`/jobs/${job_id}/unsave`)
        .then(() => {
          message.destroy();
          message.success("Job removed from saved list");
          setShouldRefetch((prev) => !prev);
        })
        .catch(() => {
          message.destroy();
          message.error("Failed to remove job from saved list");
        });
    }
  }, []);

  const handleApplyJob = (job_id) => {
    navigate(`/jobs/${job_id}/apply`);
  };

  return (
    <><div className="pt-4 md:px-12">
    <div className="flex flex-col items-center text-center">
      <h2 className="text-3xl font-semibold bg-gradient-to-r from-[#2E7D32] via-green-500 to-yellow-400 bg-clip-text text-transparent">
        Your Personalized Job Matches
      </h2>
      <p className="mt-2 text-gray-600 max-w-md">
        Discover job opportunities tailored to your skills and interests.
        We&apos;ve analyzed your profile to bring you the most relevant roles.
        Start exploring your future today!
      </p>
    </div>

    <div className="container mx-auto">
      <Card className="relative rounded-[20px] shadow-lg ">
        {jobs.length === 0 ? (
          loading ? (
            <div className="flex justify-center items-center h-64">
              <Spin size="large" />
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center h-64">
              <img src={NotFoundIcon} alt="Not Found" className="w-64 mb-4" />
              <p className="text-xl font-semibold">
                No jobs found. Please update your profile to get recommended
                jobs.
              </p>
            </div>
          )
        ) : (
          <>
            <Row gutter={[16, 20]} justify="center">
              {jobs.map((job, index) => (
                <Col key={index} xs={24} sm={12} md={12}>
                  <Card className="relative rounded-2xl border-[#D8D8D8]">
                    <div className="flex justify-between items-start">
                      <div className="flex space-x-6">
                        <img
                          src={job.company.logo_url ? `${API_URL}/${job.company.logo_url}` : JobFallback}
                          alt="Job Icon"
                          onError={(e) => { e.target.onerror = null; e.target.src = JobFallback; }}
                          className="w-16 h-16 object-cover rounded-full"
                        />
                        <div className="flex flex-col">
                          <h3 className="text-[15px] font-semibold">
                            {job.title}
                          </h3>
                          <p className="text-[13px] text-black">
                            {job.company.legal_name}
                          </p>
                          <p className="text-[13px] text-black">
                            {job.company.city}, {job.company.country}
                          </p>
                        </div>
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

                    <div className="relative flex justify-end items-start mt-8">
                      {/* <div
                        style={{
                          width: "210px",
                          height: "35px",
                          backgroundColor: "#F4F4F4",
                          borderRadius: "12px",
                        }}
                        className="flex items-center justify-center"
                      >
                        <span className="text-xs font-medium ">
                          Nanti buat applied at klo applied at, klo ga gmn?
                        </span>
                      </div> */}
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs text-[#232323]">
                        {calculateExpiresIn(job.expired_at)}
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
                            backgroundColor: job.is_applied
                              ? "#BBBBBB"
                              : "#06A73B",
                            color: job.is_applied ? "black" : "white",
                          }}
                          onClick={() => {
                            if (job.is_applied) {
                              //
                            } else {
                              handleApplyJob(job.job_id);
                            }
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
  <PaginationComponent 
        current={currentPage}
        total={totalJobs}
        pageSize={8}
        onChange={handlePageChange} /></>
  );
};

export default RecommendedJobList;
