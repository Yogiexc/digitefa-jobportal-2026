import { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Layout } from "antd";
import Navbar from "../../components/Navbar";
import Banners from "../../components/event-news/Banners";
import AllContent from "../../components/event-news/AllContent";
import EventContent from "../../components/event-news/EventContent";
import NewsContent from "../../components/event-news/NewsContent";
import Footers from "../../components/Footers";
import { useNavigate, useSearchParams } from "react-router-dom";

const EventNews = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const [currentPages, setCurrentPages] = useState(category);
  const navigate = useNavigate();

  const categories = {
    all: 0,
    event: 1,
    news: 2,
  };

  useEffect(() => {
    if (category) {
      if (!Object.keys(categories).includes(category)) {
        console.log("tolol");
        setCurrentPages("all");
        navigate("?category=all", { replace: true });
      } else {
        console.log("gg");
        navigate(`?category=${currentPages}`, { replace: true });
      }
    } else {
      console.log("kocak");
      navigate("?category=all", { replace: true });
    }
  }, [category, currentPages, navigate]);

  return (
    <HelmetProvider>
      <Helmet>
        <title>Event/News - Digitefa</title>
        <meta name="description" content="Digitefa" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Helmet>
      <Layout>
        <Navbar />
        <Banners
          currentPages={currentPages}
          setCurrentPages={setCurrentPages}
        />
        {currentPages == "all" && (
          <AllContent setCurrentPages={setCurrentPages} />
        )}
        {currentPages == "news" && <NewsContent />}
        {currentPages == "event" && <EventContent />}
        <Footers />
      </Layout>
    </HelmetProvider>
  );
};

export default EventNews;
