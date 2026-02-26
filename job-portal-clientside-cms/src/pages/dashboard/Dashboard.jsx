import { Helmet, HelmetProvider } from "react-helmet-async";
import DashboardLayout from "../../components/dashboard-layout/DashboardLayout";
import DashboardCompany from "../../components/dashboard/company/DashboardCompany";
import DashboardUniversity from "../../components/dashboard/university/DashboardUniversity";
import DashboardSuperadmin from "../../components/dashboard/superadmin/DashboardSuperadmin";

const Dashboard = () => {
  const userData = JSON.parse(sessionStorage.getItem("userData"));

  const renderDashboard = () => {
    switch (userData?.role) {
      case "superadmin":
        return <DashboardSuperadmin />;
      case "company":
        return <DashboardCompany />;
      case "university":
        return <DashboardUniversity />;
      default:
        return null;
    }
  };

  return (
    <HelmetProvider>
      <DashboardLayout>
        <Helmet>
          <title>Dashboard - CMS DIGITEFA</title>
          <meta name="description" content="DIGITEFA" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/icon.svg" />
        </Helmet>
        {renderDashboard()}
      </DashboardLayout>
    </HelmetProvider>
  );
};

export default Dashboard;
