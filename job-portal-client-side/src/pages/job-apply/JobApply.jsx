import { Helmet, HelmetProvider } from "react-helmet-async";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Layout, Card, Steps, Spin, message } from "antd";
import Navbar from "../../components/Navbar";
import Footers from "../../components/Footers";
import { useEffect, useState } from "react";
import ChooseDocument from "../../components/job-apply/ChooseDocument";
import EmployeeQuestion from "../../components/job-apply/EmployeeQuestion";
import UpdateProfile from "../../components/job-apply/UpdateProfile";
import ReviewSubmit from "../../components/job-apply/ReviewSubmit";
import { JobApplyProvider } from "./JobApplyContext";
import Api from "../../services/Api";
import SuccessAppliedJob from "../../components/job-apply/SuccessAppliedJob";

const { Step } = Steps;

const JobApply = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const step = searchParams.get("step");
  const [currentStep, setCurrentStep] = useState(step);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [jobDetail, setJobDetail] = useState();

  const checkJobId = async () => {
    try {
      setLoading(true);
      await Api.get(`/jobs-search/${jobId}`)
        .then((res) => {
          setJobDetail(res.data);
          console.log("res.data", res.data);
          if (res.data.is_applied) {
            navigate("/job-application-history");
            message.destroy();
            message.error(
              "You have applied for this job. Please check your application history."
            );
          }
        })
        .catch(() => {
          navigate("/find-jobs");
        });
    } catch (error) {
      //
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkJobId();
  }, []);

  const stepMapping = {
    "choose-document": 0,
    "employee-question": 1,
    "update-profile": 2,
    review: 3,
    "successfully-applied": 4,
  };

  useEffect(() => {
    if (!step) {
      setCurrentStep("choose-document");
      navigate("?step=choose-document", { replace: true });
    }
    if (step === "successfully-applied" && success == false) {
      setCurrentStep("choose-document");
      navigate("?step=choose-document", { replace: true });
    }
    // Cek apakah step valid
    if (!Object.keys(stepMapping).includes(step)) {
      setCurrentStep("choose-document");
      navigate("?step=choose-document", { replace: true });
    } else {
      setCurrentStep(step);
    }
  }, [step, navigate]);

  const handleChangeStep = (nextStep) => {
    navigate(`?step=${nextStep}`, { replace: true });
    window.scrollTo(0, 0);
  };

  const current = stepMapping[currentStep];

  const customTextColor = (index) => {
    if (index < current) {
      return "#15BF64";
    } else if (index === current) {
      return "#065BCC";
    } else {
      return "#BBBBBB";
    }
  };

  const customIconColor = (index) => {
    if (index < current) {
      return "#15BF64";
    } else if (index === current) {
      return "#065BCC";
    } else {
      return "#BBBBBB";
    }
  };

  const onSuccess = () => {
    setSuccess(true);
    handleChangeStep("successfully-applied");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <HelmetProvider>
      <JobApplyProvider>
        <Helmet>
          <title>Job Detail - Digitefa</title>
          <meta name="description" content="Digitefa" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/icon.svg" />
        </Helmet>
        <Layout>
          <Navbar />
          <div className="py-8 md:px-12">
            <div className="container mx-auto">
              <Card className="rounded-[20px] shadow-lg p-6">
                <Steps
                  current={current}
                  className="mb-10 custom-steps"
                  style={{
                    backgroundColor: "#F4F4F4",
                    borderRadius: "12px",
                    height: "60px",
                    padding: "10px",
                  }}
                >
                  {[...Array(4)].map((_, index) => (
                    <Step
                      key={index}
                      title={
                        <span
                          style={{
                            fontSize: "14px",
                            color: customTextColor(index),
                          }}
                        >
                          {
                            [
                              "Choose Document",
                              "Answer Employee Question",
                              "Update Profile",
                              "Review and Submit",
                            ][index]
                          }
                        </span>
                      }
                      icon={
                        <span
                          style={{
                            backgroundColor: customIconColor(index),
                            borderRadius: "50%",
                            display: "inline-block",
                            width: "24px",
                            height: "24px",
                            lineHeight: "24px",
                            textAlign: "center",
                            color: "#fff",
                            fontSize: "14px",
                          }}
                        >
                          {index + 1}
                        </span>
                      }
                    />
                  ))}
                </Steps>
                <div>
                  {currentStep === "choose-document" && (
                    <ChooseDocument
                      onNext={() => handleChangeStep("employee-question")}
                    />
                  )}
                  {currentStep === "employee-question" && (
                    <EmployeeQuestion
                      onNext={() => handleChangeStep("update-profile")}
                      onPrevious={() => handleChangeStep("choose-document")}
                    />
                  )}
                  {currentStep === "update-profile" && (
                    <UpdateProfile
                      onNext={() => handleChangeStep("review")}
                      onPrevious={() => handleChangeStep("employee-question")}
                    />
                  )}
                  {currentStep === "review" && (
                    <ReviewSubmit
                      onPrevious={() => handleChangeStep("update-profile")}
                      jobId={jobId}
                      onSuccess={() => onSuccess()}
                    />
                  )}
                  {currentStep === "successfully-applied" &&
                    success == true && (
                      <SuccessAppliedJob
                        toAppliedJobs={() =>
                          navigate("/job-application-history")
                        }
                        companyName={jobDetail?.company?.legal_name}
                        jobTitle={jobDetail?.title}
                      />
                    )}
                </div>
              </Card>
            </div>
          </div>
          <Footers />
        </Layout>
      </JobApplyProvider>
    </HelmetProvider>
  );
};

export default JobApply;
