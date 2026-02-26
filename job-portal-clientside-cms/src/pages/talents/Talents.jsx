import { Helmet, HelmetProvider } from "react-helmet-async";
import DashboardLayout from "../../components/dashboard-layout/DashboardLayout";
import TalentsList from "../../components/talents/TalentsList";

const UniversityManagement = () => {
    return (
      <HelmetProvider>
        <DashboardLayout>
          <Helmet>
            <title>Talents - CMS DIGITEFA</title>
            <meta name="description" content="DIGITEFA" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/icon.svg" />
          </Helmet>
          <TalentsList />
        </DashboardLayout>
      </HelmetProvider>
    );
  };
  
  export default UniversityManagement;
  