import { Helmet, HelmetProvider } from "react-helmet-async";
import SkillsList from "../../components/master-data/skills-category/SkillsList"
import DashboardLayout from "../../components/dashboard-layout/DashboardLayout";

const Skills = () => {
  return (
    <HelmetProvider>
      <DashboardLayout>
        <Helmet>
          <title> Master Data | Skills Category - CMS DIGITEFA </title>
          <meta name="description" content="DIGITEFA" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/icon.svg"  />
        </Helmet>
        <SkillsList />
      </DashboardLayout>
    </HelmetProvider>
  );
};

export default Skills;
