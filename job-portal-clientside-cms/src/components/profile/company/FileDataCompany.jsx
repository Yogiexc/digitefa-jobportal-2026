import { useNavigate, useLocation } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Button } from "antd";
import CheckIcon from "../../../assets/svg/Check.svg";
import DocumentIcon from "../../../assets/svg/Document.svg";
import FileIcon from "../../../assets/svg/File.svg";
import BriefcaseIcon from "../../../assets/svg/Briefcase.svg";
import Logo from "../../../assets/svg/DIGITEFA.svg";

const FillDataCompany = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const handleNext = () => {
    navigate("/fill-profile-company", { state: state });
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Fill Data Company - CMS DIGITEFA</title>
        <meta name="description" content="DIGITEFA" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="./DIGITEFA.svg" />
      </Helmet>

      <div className="flex min-h-screen items-center justify-center bg-gray-100 py-10">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-4xl flex">
          <div className="flex flex-col justify-center items-center w-1/2">
            <img src={Logo} alt="DIGITEFA" className="w-42 ml-3" />
          </div>
          <div className="flex flex-col justify-center w-full p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Let’s Finish setting up your Profile
            </h2>
            <p className="text-[12px] text-gray-400 mb-6">
              Your company profile needs to be updated with more details to
              provide a comprehensive overview of your company and manage job
              openings effectively. This will help in enhancing recruitment
              efficiency and attracting top talent.
            </p>
            <div className="mb-6">
              <div className="flex items-start mb-4">
                <img
                  src={DocumentIcon}
                  alt="Complete Company Details"
                  className="w-[30px] text-red-500 mr-3"
                />
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-3">
                    Complete Company Details
                  </h3>
                  <p className="text-[12px] text-gray-900 mb-3">
                    Fill in essential information about your company, including
                    its history, mission, values, and company culture.
                  </p>
                </div>
              </div>
              <div className="flex items-start mb-4">
                <img
                  src={FileIcon}
                  alt="Effortless Job Tracking"
                  className="w-[30px] text-red-500 mr-3"
                />
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-3">
                    Effortless Job Tracking
                  </h3>
                  <p className="text-[12px] text-gray-900 mb-3">
                    Easily monitor and manage all your open positions, ensuring
                    you never miss a qualified candidate.
                  </p>
                </div>
              </div>
              <div className="flex items-start mb-4">
                <img
                  src={BriefcaseIcon}
                  alt="Efficient Recruitment Management"
                  className="w-[30px] text-red-500 mr-3"
                />
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-3">
                    Efficient Recruitment Management
                  </h3>
                  <p className="text-[12px] text-gray-900 mb-3">
                    Simplify the entire recruitment process, from candidate
                    screening to onboarding, saving time and resources.
                  </p>
                </div>
              </div>
              <div className="flex items-start mb-4">
                <img
                  src={CheckIcon}
                  alt="Ensuring a Perfect Match for Your Company's Needs"
                  className="w-[30px] text-red-500 mr-3"
                />
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-3">
                    {" "}
                    Ensuring a Perfect Match for Your Company&apos;s Needs
                  </h3>
                  <p className="text-[12px] text-gray-900 mb-3">
                    This emphasizes the focus on finding the right talent rather
                    than just posting jobs.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                htmlType="submit"
                className="h-10 w-20 bg-red-500 hover:bg-red-700 text-white font-medium py-1 px-4 rounded-xl focus:outline-none focus:shadow-outline"
                onClick={handleNext}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default FillDataCompany;
