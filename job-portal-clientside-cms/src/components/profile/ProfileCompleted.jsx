import { Helmet, HelmetProvider } from "react-helmet-async";
import { Button } from "antd";
import CompletedIcon from "../../assets/svg/Completed.svg"

const ProfileCompleted = () => {

  return (
    <HelmetProvider>
    <Helmet>
      <title>Verification Successfully  - CMS DIGITEFA </title>
      <meta name="description" content="DIGITEFA" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="./DIGITEFA.svg" />
    </Helmet>

    <div className="flex min-h-screen items-center justify-center bg-gray-100 py-10">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg text-center">
        <div className="flex justify-center mb-6">
          <img src={CompletedIcon} alt="Profile Completed" className="w-16" />
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Profile Completed
        </h2>
        <p className="text-base text-gray-400 mb-6">
        All Set! Now, get ready to explore the resource available to you.
        </p>
        
        <Button
          type="submit"
          htmlType="submit"
          className="h-10 w-full bg-red-500 hover:bg-red-700 text-white font-medium py-1 px-4 rounded-xl focus:outline-none focus:shadow-outline"
          href="/login"
        >
          Go To Dashboard
        </Button>
      </div>
    </div>
    </HelmetProvider>
  );
};

export default ProfileCompleted;
