import { Helmet, HelmetProvider } from "react-helmet-async";
import PrivacyPolicyList from "../../components/content/privacy-policy/PrivacyPolicyList";
import DashboardLayout from "../../components/dashboard-layout/DashboardLayout";

const PrivacyPolicy = () => {
    return (
      <HelmetProvider>
        <DashboardLayout>
          <Helmet>
            <title>Content | Privacy Policy - CMS DIGITEFA </title>
            <meta name="description" content="DIGITEFA" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/icon.svg"  />
          </Helmet>
          <PrivacyPolicyList />
        </DashboardLayout>
      </HelmetProvider>
    );
  };
  
export default PrivacyPolicy;
  