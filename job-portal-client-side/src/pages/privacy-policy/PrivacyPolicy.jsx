import { Layout } from "antd";
import Navbar from "../../components/Navbar";
import Banners from "../../components/privacy-policy/Banners";
import PrivacyPolicyContent from "../../components/privacy-policy/PrivacyPolicyContent";
import Footers from "../../components/Footers";
import { Helmet, HelmetProvider } from "react-helmet-async";

const PrivacyPolicy = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Privacy Policy - Digitefa</title>
        <meta name="description" content="Digitefa" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Helmet>
      <Layout>
        <Navbar />
        <Banners />
        <PrivacyPolicyContent />
        <Footers />
      </Layout>
    </HelmetProvider>
  );
};

export default PrivacyPolicy;
