import { Helmet, HelmetProvider } from "react-helmet-async";
import UserList from "../../components/system-administrator/UserList";
import DashboardLayout from "../../components/dashboard-layout/DashboardLayout";

const SystemAdministrator = () => {
    return (
      <HelmetProvider>
        <DashboardLayout>
          <Helmet>
            <title>System Administrator - CMS DIGITEFA </title>
            <meta name="description" content="DIGITEFA" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/icon.svg"  />
          </Helmet>
          <UserList />
        </DashboardLayout>
      </HelmetProvider>
    );
  };
  
  export default SystemAdministrator;
  