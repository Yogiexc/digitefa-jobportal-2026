import { useNavigate, useLocation } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Button } from "antd";
import CheckIcon from "../../../assets/svg/Check.svg";
import DocumentIcon from "../../../assets/svg/Document.svg";
import FileIcon from "../../../assets/svg/File.svg";
import AcademicIcon from "../../../assets/svg/Academic.svg";
import Logo from "../../../assets/svg/DIGITEFA.svg";

const FillDataUniversity = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location; 

  const handleNext = () => {
    navigate("/fill-profile-university", { state: state });
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Fill Data University - CMS DIGITEFA</title>
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
              Your profile needs to be updated with more details to provide a comprehensive view of your university and manage student information effectively. This will help in enhancing administrative efficiency and academic support.
            </p>
            <div className="mb-6">
              <div className="flex items-start mb-4">
                <img src={DocumentIcon} alt="Complete University Details" className="w-[30px] text-red-500 mr-3" />
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Complete University Details</h3>
                  <p className="text-[12px] text-gray-900 mb-3">Fill in essential information about your university, including its history, mission, and key facilities.</p>
                </div>
              </div>
              <div className="flex items-start mb-4">
                <img src={FileIcon} alt="Comprehensive Data Presentation" className="w-[30px] text-red-500 mr-3" />
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Comprehensive Data Presentation</h3>
                  <p className="text-[12px] text-gray-900 mb-3">Benefit from complete and well-organized data, enabling better decision-making and academic support.</p>
                </div>
              </div>
              <div className="flex items-start mb-4">
                <img src={AcademicIcon} alt="Track Academic Progress" className="w-[30px] text-red-500 mr-3" />
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Track Academic Progress</h3>
                  <p className="text-[12px] text-gray-900 mb-3">Monitor and support students academic journeys by keeping detailed records of their achievements and progress.</p>
                </div>
              </div>
              <div className="flex items-start mb-4">
                <img src={CheckIcon} alt="Effortless Student Management" className="w-[30px] text-red-500 mr-3" />
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Effortless Student Management</h3>
                  <p className="text-[12px] text-gray-900 mb-3">Manage student information and records more easily and efficiently, saving time and reducing administrative workload.</p>
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

export default FillDataUniversity;
