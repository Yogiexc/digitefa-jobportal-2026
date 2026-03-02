import { Layout } from "antd";
import Navbar from "../../components/Navbar";
import Banners from "../../components/home/Banners";
import Information from "../../components/home/Information";
import LatestJobsOpen from "../../components/home/LatestJobsOpen";
import RecommendedJobs from "../../components/home/RecommendedJobs";
import WhyChoose from "../../components/home/WhyChoose";
import Footers from "../../components/Footers";
import { Helmet, HelmetProvider } from "react-helmet-async";
import BigData from "../../components/home/BigData";

const Home = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Digitefa - Job Portal</title>
        <meta name="description" content="Digitefa" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Helmet>
      <Layout>
        <Navbar />
        <Banners />
        <Information />
        <RecommendedJobs />
        <LatestJobsOpen />
        <WhyChoose />
        <BigData />
        <Footers />
      </Layout>
    </HelmetProvider>
  );
};

export default Home;
