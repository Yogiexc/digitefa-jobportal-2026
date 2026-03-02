import { Helmet, HelmetProvider } from "react-helmet-async";
import DashboardLayout from "../../components/dashboard-layout/DashboardLayout";
import RegisteredStudentList from "../../components/student-management/registered-student/RegisteredStudentList";

const RegisteredStudent = () => {
    return (
      <HelmetProvider>
        <DashboardLayout>
          <Helmet>
            <title>Student Management | Registered Student - CMS DIGITEFA </title>
            <meta name="description" content="DIGITEFA" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/icon.svg"  />
          </Helmet>
          <RegisteredStudentList />
        </DashboardLayout>
      </HelmetProvider>
    );
  };
  
  export default RegisteredStudent;
  