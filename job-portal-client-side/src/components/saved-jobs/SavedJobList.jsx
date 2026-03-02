import { useState, useEffect, useCallback } from "react";
import { Card, Button, Col, Row, message } from "antd";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import Api from "../../services/Api";
import { useNavigate } from "react-router-dom";
import NotFoundIcon from "../../assets/images/404.png";

const calculateDaysAgo = (published_at) => {
  const publishedDate = new Date(published_at);
  const currentDate = new Date();
  const differenceInTime = currentDate - publishedDate;
  const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
  return differenceInDays;
};

const SavedJobList = () => {
  const [jobs, setJobs] = useState([]);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_IMAGE_API;

  useEffect(() => {
    Api.get("/saved/jobs", {
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
      });
  }, [shouldRefetch]);

  const handleBookmarkClick = useCallback((index, job_id) => {
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
  }, []);

  const handleApplyJob = (job_id) => {
    navigate(`/jobs/${job_id}/apply`);
  };

  return (
    <div className="py-8 md:px-12">
      <div className="container mx-auto">
        <Card className="relative rounded-[20px] shadow-lg ">
          {jobs.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64">
              <img src={NotFoundIcon} alt="Not Found" className="w-64 mb-4" />
              <p className="text-xl font-semibold">No jobs saved</p>
            </div>
          ) : (
            <>
              <Row gutter={[16, 48]} justify="center">
                {jobs.map((job, index) => (
                  <Col key={index} xs={24} sm={12} md={12}>
                    <Card className="relative rounded-2xl border-[#D8D8D8]">
                      <div className="flex justify-between items-start">
                        <div className="flex space-x-6">
                          <img
                            src={`${API_URL}/${job.company.logo_url}`}
                            alt="Job Icon"
                            className="w-16"
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
                            backgroundColor: "green",
                            width: 46,
                            height: 40,
                          }}
                          onClick={() => handleBookmarkClick(index, job.job_id)}
                        >
                          <BookmarkIcon
                            className="size-[14px]"
                            style={{ color: "white" }}
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
                              Apply
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

export default SavedJobList;
