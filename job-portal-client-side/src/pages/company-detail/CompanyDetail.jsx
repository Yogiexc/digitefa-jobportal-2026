import { Helmet, HelmetProvider } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { Layout } from "antd";
import Navbar from "../../components/Navbar";
import CompanyDetailList from "../../components/company-detail/CompanyDetailList";
import Footers from "../../components/Footers";

const CompanyDetail = () => {
  const { companyId } = useParams();

  return (
    <HelmetProvider>
      <Helmet>
        <title>Company Detail - Digitefa</title>
        <meta name="description" content="Digitefa" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Helmet>
      <Layout>
        <Navbar />
        <CompanyDetailList companyId={companyId} />
        <Footers />
      </Layout>
    </HelmetProvider>
  );
};

export default CompanyDetail;
