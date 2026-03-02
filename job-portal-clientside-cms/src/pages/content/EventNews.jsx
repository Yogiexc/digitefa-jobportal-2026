import { Helmet, HelmetProvider } from "react-helmet-async";
import DashboardLayout from "../../components/dashboard-layout/DashboardLayout";
import EventNewsList from "../../components/content/event-news/EventNewsList";

const EventNews = () => {
    return (
      <HelmetProvider>
        <DashboardLayout>
          <Helmet>
            <title>Content | Event & News - CMS DIGITEFA </title>
            <meta name="description" content="DIGITEFA" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/icon.svg"  />
          </Helmet>
          <EventNewsList />
        </DashboardLayout>
      </HelmetProvider>
    );
  };
  
  export default EventNews;
  