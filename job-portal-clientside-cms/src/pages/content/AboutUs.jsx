import { Helmet, HelmetProvider } from "react-helmet-async";
import AboutUsList from "../../components/content/about-us/AboutUsList";
import DashboardLayout from "../../components/dashboard-layout/DashboardLayout";

const AboutUs = () => {
    return (
      <HelmetProvider>
        <DashboardLayout>
          <Helmet>
            <title>Content | About Us - CMS DIGITEFA </title>
            <meta name="description" content="DIGITEFA" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/icon.svg"  />
          </Helmet>
          <AboutUsList />
        </DashboardLayout>
      </HelmetProvider>
    );
  };
  
  export default AboutUs;
  