import { Helmet, HelmetProvider } from "react-helmet-async";
import JobSeekerList from "../../components/user-management/job-seeker/JobSeekerList";
import DashboardLayout from "../../components/dashboard-layout/DashboardLayout";

const JobSeeker = () => {
    return (
      <HelmetProvider>
        <DashboardLayout>
          <Helmet>
            <title>User Management | Job Seeker - CMS DIGITEFA</title>
            <meta name="description" content="DIGITEFA" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/icon.svg" />
          </Helmet>
          <JobSeekerList />
        </DashboardLayout>
      </HelmetProvider>
    );
  };
  
export default JobSeeker;
  