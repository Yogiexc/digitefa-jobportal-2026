import { Layout } from "antd";
import Navbar from "../../components/Navbar";
import Footers from "../../components/Footers";
import Email from "../../components/settings/Email";
import Password from "../../components/settings/Password";
import { Helmet, HelmetProvider } from "react-helmet-async";

const Settings = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Setting - Digitefa</title>
        <meta name="description" content="Digitefa" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Helmet>
      <Layout className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <Navbar />
        <div className="py-8 ">
            <Email />
            <Password />
          </div>
        </div>
        <Footers />
      </Layout>
    </HelmetProvider>
  );
};

export default Settings;
