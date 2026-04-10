import { Helmet, HelmetProvider } from "react-helmet-async";
import DashboardLayout from "../../components/dashboard-layout/DashboardLayout";
import InterviewListTable from "../../components/interviews/InterviewListTable";

const InterviewList = () => {
  return (
    <HelmetProvider>
      <DashboardLayout>
        <Helmet>
          <title>Interviews - CMS DIGITEFA </title>
          <meta name="description" content="DIGITEFA Interviews" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/icon.svg"  />
        </Helmet>
        <InterviewListTable />
      </DashboardLayout>
    </HelmetProvider>
  );
};

export default InterviewList;
