import { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Breadcrumb, Layout, Spin } from "antd";
import Navbar from "../../components/Navbar";
import Footers from "../../components/Footers";
import { useParams } from "react-router-dom";
import Api from "../../services/Api";
import PagesNotFound from "../PagesNotFound";
import '../../../src/richtexteditor.css'

const DetailEventNews = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [eventNewsData, setEventNewsData] = useState();
  const API_URL = import.meta.env.VITE_IMAGE_API;

  const fetchData = () => {
    Api.get(`/content/event-news/${slug}`)
      .then((response) => {
        const data = response.data;
        setEventNewsData(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching event news detail data", error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!eventNewsData) {
    return <PagesNotFound />;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  };
  
  return (
    <HelmetProvider>
      <Helmet>
        <title>{eventNewsData.title}- Digitefa</title>
        <meta name="description" content="Digitefa" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Helmet>
      <Layout>
        <Navbar />

        {eventNewsData && (
          <div className="px-4 md:px-16 py-8 bg-white">
            <Breadcrumb
              separator=">"
              items={[
                {
                  title:
                    eventNewsData?.category.charAt(0).toUpperCase() +
                    eventNewsData?.category.slice(1).toLowerCase(),
                },
                {
                  title: eventNewsData.title,
                },
              ]}
            />
            <div className="flex flex-col">
              <h1 className="text-3xl font-semibold mb-4 mt-5">
                {eventNewsData.title}
              </h1>
              <h1 className="text-[10px] mb-4 ">
              Published in DIGITEFA • {eventNewsData.category}
              </h1>
              <p className="text-gray-500 text-sm">
                {formatDate(eventNewsData.created_at)}
              </p>

              <div className="h-[500px] rounded-lg overflow-hidden mb-4 mt-5">
                <img
                  src={API_URL + "/" + eventNewsData.image_url}
                  alt={eventNewsData.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="prose max-w-none mt-4"
                dangerouslySetInnerHTML={{ __html: eventNewsData.content }}
              />
            </div>
          </div>
        )}
        <Footers />
      </Layout>
    </HelmetProvider>
  );
};

export default DetailEventNews;
