import { Layout } from "antd";
import Navbar from "../../components/Navbar";
import Banners from "../../components/about-us/Banners";
import AboutUsContent from "../../components/about-us/AboutUsContent";
import Footers from "../../components/Footers";
import { Helmet, HelmetProvider } from "react-helmet-async";

const AboutUs = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>About Us - Digitefa</title>
        <meta name="description" content="Digitefa" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Helmet>
      <Layout>
        <Navbar />
        <Banners />
        <AboutUsContent />
        <Footers />
      </Layout>
    </HelmetProvider>
  );
};

export default AboutUs;
