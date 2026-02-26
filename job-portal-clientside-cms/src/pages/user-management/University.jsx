import { Helmet, HelmetProvider } from "react-helmet-async";
import UniversityList from "../../components/user-management/university/UniversityList";
import DashboardLayout from "../../components/dashboard-layout/DashboardLayout";

const University = () => {
    return (
      <HelmetProvider>
        <DashboardLayout>
          <Helmet>
            <title>User Management | University - CMS DIGITEFA</title>
            <meta name="description" content="DIGITEFA" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/icon.svg" />
          </Helmet>
          <UniversityList />
        </DashboardLayout>
      </HelmetProvider>
    );
  };
  
export default University;
  