import { Helmet, HelmetProvider } from "react-helmet-async";
import CompanyList from "../../components/company-management/CompanyList";
import DashboardLayout from "../../components/dashboard-layout/DashboardLayout";

const UniversityManagement = () => {
    return (
      <HelmetProvider>
        <DashboardLayout>
          <Helmet>
            <title>Company Management - CMS DIGITEFA</title>
            <meta name="description" content="DIGITEFA" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/icon.svg" />
          </Helmet>
          <CompanyList />
        </DashboardLayout>
      </HelmetProvider>
    );
  };
  
  export default UniversityManagement;
  