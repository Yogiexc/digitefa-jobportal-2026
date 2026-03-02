import { Helmet, HelmetProvider } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { Layout } from "antd";
import Navbar from "../../components/Navbar";
import JobDetailList from "../../components/job-detail/JobDetailList";
import Footers from "../../components/Footers";

const JobDetail = () => {
  const { jobId } = useParams();

  return (
    <HelmetProvider>
      <Helmet>
        <title>Job Detail - Digitefa</title>
        <meta name="description" content="Digitefa" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Helmet>
      <Layout>
        <Navbar />
        <JobDetailList jobId={jobId} />
        <Footers />
      </Layout>
    </HelmetProvider>
  );
};

export default JobDetail;
