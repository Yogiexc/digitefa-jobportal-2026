import { Helmet, HelmetProvider } from "react-helmet-async";
import { Button } from "antd";
import CompletedIcon from "../../assets/svg/Completed.svg";
import { useNavigate } from "react-router-dom";

const RequestProfile = () => {
  const navigateTo = useNavigate();
  const userData = JSON.parse(sessionStorage.getItem("userData"));

  const onLogout = () => {
    sessionStorage.removeItem("userData");
    sessionStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    navigateTo("/login");
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Verification Successfully - CMS DIGITEFA </title>
        <meta name="description" content="DIGITEFA" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="./DIGITEFA.svg" />
      </Helmet>

      <div className="flex min-h-screen items-center justify-center bg-gray-100 py-10">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg text-center">
          <div className="flex justify-center mb-6">
            <img src={CompletedIcon} alt="Profile Completed" className="w-16" />
          </div>

          <h2 className="text-xl font-semibold text-[#232323] mb-4">
            Your {userData.role == "company" ? "Company" : "University"} Request
            is Under Review
          </h2>
          <p className="text-base text-[#9A9A9A] mb-6">
            Thank you for submitting a request to add a new{" "}
            {userData.role == "company" ? "Company" : "University"}. Your
            request is currently being reviewed by our team. Please wait a
            moment for approval.
          </p>
          <p className="text-base text-[#9A9A9A] mb-6">
            Make sure to check your email regularly for updates from us. If you
            have any further questions, feel free to contact our support team.
          </p>

          <Button
            type="primary"
            style={{ width: 435, height: 40, borderRadius: 12 }}
            onClick={onLogout}
          >
            <span className="font-medium"> Logout </span>
          </Button>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default RequestProfile;
