import { Layout } from "antd";
import Navbar from "../../components/Navbar";
import Footers from "../../components/Footers";
import Pagination from "../../components/Pagination";
import JobApplicationHistoryList from "../../components/job-application-history/JobApplicationHistoryList";
import { Helmet, HelmetProvider } from "react-helmet-async";

const JobApplicationHistory = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Job Application History - Digitefa</title>
        <meta name="description" content="Digitefa" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Helmet>
      <Layout className="min-h-screen flex flex-col">
      <div className="bg-white flex-grow">
          <Navbar />
          <JobApplicationHistoryList />
          <Pagination />
        </div>
          <Footers />
      </Layout>
    </HelmetProvider>
  );
};

export default JobApplicationHistory;
