import { Helmet, HelmetProvider } from "react-helmet-async";
import ProfileUniversity from "../../components/profile/university/ProfileUniversity";
import DashboardLayout from "../../components/dashboard-layout/DashboardLayout";

const Profile = () => {
    return (
      <HelmetProvider>
        <DashboardLayout>
          <Helmet>
            <title>Profile - CMS DIGITEFA </title>
            <meta name="description" content="DIGITEFA" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/icon.svg"  />
          </Helmet>
          <ProfileUniversity />
        </DashboardLayout>
      </HelmetProvider>
    );
  };
  
  export default Profile;
  