import { Helmet, HelmetProvider } from "react-helmet-async";
import { Button } from "antd";
import SuccessfullyIcon from "../../assets/svg/VerificationSuccessfully.svg";
import { Link } from "react-router-dom";

const VerificationSuccessfully = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Verification Successfully - Digitefa </title>
        <meta name="description" content="Digitefa" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="./digitefa.svg" />
      </Helmet>

      <div className="flex min-h-screen items-center justify-center bg-gray-100 py-10">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg text-center">
          <div className="flex justify-center mb-6">
            <img
              src={SuccessfullyIcon}
              alt="Verification Successfully"
              className="w-16"
            />
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Verification Successfully
          </h2>
          <p className="text-base text-gray-400 mb-6">
            Congratulations! You have been successfully authenticated.
          </p>

          <Link to="/">
            <Button
              type="submit"
              htmlType="submit"
              className="h-10 w-full bg-green-500 hover:bg-green-700 text-white font-medium py-1 px-4 rounded-xl focus:outline-none focus:shadow-outline"
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default VerificationSuccessfully;
