import { Helmet, HelmetProvider } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Button, Layout } from "antd";
import Navbar from "../components/Navbar";
import Footers from "../components/Footers";
import NotFoundIcon from "../assets/images/404.png";

const PagesNotFound = () => {
  const navigate = useNavigate();
  return (
    <HelmetProvider>
      <Helmet>
        <title>Page Not Found - Digitefa</title>
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
              alt="404"
              className="w-[300px] h-[230px] mb-10"
            />
          </div>
          <h1 className="text-2xl font-semibold mb-5">Page Not Found</h1>
          <p className="text-base text-[#9A9A9A] mb-5 max-w-2xl">
            {`Sorry, the page you're looking for doesn't exist. It might have been
          removed, had its name changed, or is temporarily unavailable. Please
          check the URL or return to the homepage.`}
          </p>
          <Button
            type="primary"
            style={{ width: 650, height: 40, borderRadius: 12 }}
            onClick={() => navigate("/")}
          >
            <span className="font-medium"> Back to Homepage </span>
          </Button>
        </div>
        <Footers />
      </Layout>
    </HelmetProvider>
  );
};

export default PagesNotFound;
