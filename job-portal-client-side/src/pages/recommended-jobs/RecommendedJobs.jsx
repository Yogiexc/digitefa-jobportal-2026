import { Layout } from "antd";
import Navbar from "../../components/Navbar";
import Footers from "../../components/Footers";
import { Helmet, HelmetProvider } from "react-helmet-async";
import RecommendedJobList from "../../components/recommended-jobs/RecommendedJobList";

const RecommendedJobs = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Recommended Jobs - Digitefa</title>
        <meta name="description" content="Digitefa" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Helmet>
      <Layout className="min-h-screen flex flex-col">
        <div className="bg-white flex-grow">
          <Navbar />
          <RecommendedJobList />
        </div>
        <Footers />
      </Layout>
    </HelmetProvider>
  );
};

export default RecommendedJobs;
