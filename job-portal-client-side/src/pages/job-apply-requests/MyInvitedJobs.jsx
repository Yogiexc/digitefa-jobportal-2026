import { Layout } from "antd";
import Navbar from "../../components/Navbar";
import RequestedJobList from "../../components/requested-jobs/RequestedJobList";
import Footers from "../../components/Footers";
import Pagination from "../../components/Pagination";
import { Helmet, HelmetProvider } from "react-helmet-async";

const MyInvitedJobs = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>My Invitations - Digitefa</title>
        <meta name="description" content="Digitefa Job Invitations" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Helmet>
      <Layout className="min-h-screen flex flex-col">
        <div className="bg-[#F8F8F8] flex-grow">
          <Navbar />
          <RequestedJobList />
        </div>
        <Footers />
      </Layout>
    </HelmetProvider>
  );
};

export default MyInvitedJobs;
