import { Helmet, HelmetProvider } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import LockIcon from "../../assets/svg/Lock.svg";

const ResetSuccessfully = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/login");
  };

  return (
    <HelmetProvider>
    <Helmet>
      <title>Reset Password Successfully  - Digitefa </title>
      <meta name="description" content="Digitefa" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="./digitefa.svg" />
    </Helmet>

    <div className="flex min-h-screen items-center justify-center bg-gray-100 py-10">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg text-center">
        <div className="flex justify-center mb-6">
          <img src={LockIcon} alt="Lock" className="w-16" />
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Password Reset Successfully
        </h2>
        <p className="text-base text-gray-400 mb-6">
          Login into your account with your new password 
        </p>
        
        {/* BUTTON BACK TO LOGIN */}
        <Button
          type="primary"
          htmlType="submit"
          className="h-10 w-full bg-green-500 hover:bg-green-700 text-white font-medium py-1 px-4 rounded-xl focus:outline-none focus:shadow-outline"
          onClick={handleNext}
        >
          Login
        </Button>
      </div>
    </div>
    </HelmetProvider>
  );
};

export default ResetSuccessfully;
