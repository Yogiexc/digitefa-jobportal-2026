import { Helmet, HelmetProvider } from "react-helmet-async";
import ExperienceLevelList from "../../components/master-data/experience-level/ExperienceLevelList";
import DashboardLayout from "../../components/dashboard-layout/DashboardLayout";

const ExperienceLevel = () => {
  return (
    <HelmetProvider>
      <DashboardLayout>
        <Helmet>
          <title>Master Data | Experience Level - CMS DIGITEFA </title>
          <meta name="description" content="DIGITEFA" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/icon.svg"  />
        </Helmet>
        <ExperienceLevelList />
      </DashboardLayout>
    </HelmetProvider>
  );
};

export default ExperienceLevel;
