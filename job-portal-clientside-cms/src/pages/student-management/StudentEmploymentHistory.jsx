import { Helmet, HelmetProvider } from "react-helmet-async";
import DashboardLayout from "../../components/dashboard-layout/DashboardLayout";
import StudentEmploymentHistoryList from "../../components/student-management/student-employment-history/StudentEmploymentHistoryList";

const StudentEmploymentHistory = () => {
    return (
      <HelmetProvider>
        <DashboardLayout>
          <Helmet>
            <title>Student Management | Student Employment History - CMS DIGITEFA </title>
            <meta name="description" content="DIGITEFA" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/icon.svg"  />
          </Helmet>
          <StudentEmploymentHistoryList />
        </DashboardLayout>
      </HelmetProvider>
    );
  };
  
  export default StudentEmploymentHistory;
  