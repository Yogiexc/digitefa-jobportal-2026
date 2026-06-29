import { Helmet, HelmetProvider } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Button, Layout } from "antd";
import Navbar from "../components/Navbar";
import Footers from "../components/Footers";
import NotFoundIcon from "../assets/images/404_expired.png";

const ExpiredInvitationNotFound = () => {
  const navigate = useNavigate();
  return (
    <HelmetProvider>
      <Helmet>
        <title>Expired Invitation - Digitefa</title>
        <meta name="description" content="Digitefa" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Helmet>
      <Layout>
        <Navbar />
        <div className="flex flex-col items-center min-h-screen text-center mt-5">
          <div className="flex items-center">
            <img
              src={NotFoundIcon}
              alt="404 Expired"
              className="w-[300px] h-[230px] mb-10 object-contain"
            />
          </div>
          <h1 className="text-2xl font-semibold mb-5">Invitation Expired</h1>
          <p className="text-base text-[#9A9A9A] mb-5 max-w-2xl">
            {`Sorry, the job invitation you are trying to access has expired and is no longer available. Please check your other invitations or return to the homepage.`}
          </p>
          <Button
            type="primary"
            style={{ width: 650, height: 40, borderRadius: 12 }}
            onClick={() => navigate("/invited-jobs")}
          >
            <span className="font-medium"> Back to My Invitations </span>
          </Button>
        </div>
        <Footers />
      </Layout>
    </HelmetProvider>
  );
};

export default ExpiredInvitationNotFound;
