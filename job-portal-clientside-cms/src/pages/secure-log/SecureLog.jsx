import { Helmet, HelmetProvider } from "react-helmet-async";
import DashboardLayout from "../../components/dashboard-layout/DashboardLayout";
import SecureList from "../../components/secure-log/SecureList";

const SecureLog = () => {
  return (
    <HelmetProvider>
      <DashboardLayout>
        <Helmet>
          <title>Secure Log - CMS DIGITEFA</title>
          <meta name="description" content="DIGITEFA" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/icon.svg" />
        </Helmet>
        <SecureList />
      </DashboardLayout>
    </HelmetProvider>
  );
};

export default SecureLog;
