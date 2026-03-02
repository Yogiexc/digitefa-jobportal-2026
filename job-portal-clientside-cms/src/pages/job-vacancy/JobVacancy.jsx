import { Helmet, HelmetProvider } from "react-helmet-async";
import JobVacancyList from "../../components/job-vacancy/JobVacancyList";
import DashboardLayout from "../../components/dashboard-layout/DashboardLayout";

const JobVacancy = () => {
    return (
      <HelmetProvider>
        <DashboardLayout>
          <Helmet>
            <title>Job Vacancy - CMS DIGITEFA </title>
            <meta name="description" content="DIGITEFA" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/icon.svg"  />
          </Helmet>
          <JobVacancyList />
        </DashboardLayout>
      </HelmetProvider>
    );
  };
  
  export default JobVacancy;
  