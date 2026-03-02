import { Layout } from "antd";
import Navbar from "../../components/Navbar";
import SavedJobsList from "../../components/saved-jobs/SavedJobList";
import Footers from "../../components/Footers";
import Pagination from "../../components/Pagination";
import { Helmet, HelmetProvider } from "react-helmet-async";

const SavedJobs = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Saved Job - Digitefa</title>
        <meta name="description" content="Digitefa" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Helmet>
      <Layout className="min-h-screen flex flex-col">
        <div className="bg-white flex-grow">
          <Navbar />
          <SavedJobsList />
          <Pagination />
        </div>
        <Footers />
      </Layout>
    </HelmetProvider>
  );
};

export default SavedJobs;
