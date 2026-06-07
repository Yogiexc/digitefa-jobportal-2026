import { useState, useEffect } from "react";
import { Card, Button, Col, Row, message, Tag } from "antd";
import { EyeIcon } from "@heroicons/react/24/outline";
import Api from "../../services/Api";
import { useNavigate } from "react-router-dom";
import NotFoundIcon from "../../assets/images/404.png";
import JobIcon from "../../assets/images/job.jpg";

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

const RequestedJobList = () => {
  const [jobs, setJobs] = useState([]);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_IMAGE_API;

  useEffect(() => {
    Api.get("/requested/jobs", {
      params: {
        page: 1,
        pageSize: 8,
      },
    })
      .then((response) => {
        const jobsData = response.data ?? [];
        setJobs(jobsData);
      })
      .catch((error) => {
        console.error("Error fetching requested jobs:", error);
        message.error("Failed to load requested jobs");
      });
  }, [shouldRefetch]);

  const handleApplyJob = (job_id) => {
    navigate(`/jobs/${job_id}/apply`);
  };

  return (
    <div className="py-8 md:px-12">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-6 mx-2 text-[#06A73B]">My Invitations</h2>
        <Card className="relative rounded-[20px] shadow-lg ">
          {jobs.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64">
              <img src={NotFoundIcon} alt="Not Found" className="w-64 mb-4" />
              <p className="text-xl font-semibold">No job invitations yet</p>
              <p className="text-gray-500 text-sm">Companies will invite you directly to jobs if your AI profile matches well.</p>
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
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = JobIcon;
                            }}
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
                        <Tag color={job.status === "applied" ? "green" : "volcano"}>
                            {job.status === "applied" ? "Applied" : "Not Applied"}
                        </Tag>
                      </div>

                      <div className="relative flex justify-end items-start mt-8">
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
                            icon={<EyeIcon className="w-4 h-4"/>}
                          >
                            <span
                              className="text-[12px] font-medium"
                              onClick={() => {
                                navigate(`/jobs/${job.job_id}`);
                              }}
                            >
                              Detail
                            </span>
                          </Button>
                          <Button
                            style={{
                              borderRadius: 12,
                              height: 40,
                              width: 100,
                              backgroundColor: job.status === "applied"
                                ? "#BBBBBB"
                                : "#06A73B",
                              color: job.status === "applied" ? "black" : "white",
                            }}
                            onClick={() => {
                              if (job.status !== "applied") {
                                handleApplyJob(job.job_id);
                              }
                            }}
                          >
                            <span className="text-[12px] font-medium">
                              {job.status === "applied" ? "Applied" : "Apply"}
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

export default RequestedJobList;
