import { Button, Card, Spin } from "antd";
import { useEffect, useState } from "react";
import Api from "../../services/Api";
import { useNavigate } from "react-router-dom";
import NoImageAvailable from "../../assets/images/NoImage.jpg";
import '../../../src/richtexteditor.css'

const AllContent = ({ setCurrentPages }) => {
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const API_URL = import.meta.env.VITE_IMAGE_API;
  const navigate = useNavigate();

  const fetchEvent = () => {
    Api.get(`/content/event-news?category=event`)
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchNews = () => {
    Api.get(`/content/event-news?category=news`)
      .then((response) => {
        setNews(response.data);
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNews();
    fetchEvent();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="px-4 md:px-16 py-8 bg-white">
      <div className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[32px] font-semibold text-[#06A73B]">News</h2>
          <Button
            style={{ width: 140, height: 48, borderRadius: 12 }}
            onClick={() => setCurrentPages("news")}
          >
            <span className="text-base text-[#232323] font-medium">
              View All News
            </span>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {news.map((item, index) => (
            <Card
              key={index}
              hoverable
              className="transition-transform transform duration-300 ease-in-out hover:scale-[1.02]"
              onClick={() => navigate(`/event-news/${item.slug}`)}
              cover={
                <img
                  alt="news image"
                  src={item.image_url ? `${API_URL}/${item.image_url}` : NoImageAvailable}
                  style={{ height: 210, objectFit: "cover" }}
                />
              }
            >
              <Card.Meta
                title={
                  <span className="text-[15px] font-semibold">
                    {item.title}
                  </span>
                }
                description={
                  <div>
                    <div
                      className="text-xs text-[#232323] mb-5"
                      dangerouslySetInnerHTML={{
                        __html:
                          item.content.length > 100
                            ? `${item.content.substring(0, 100)}...`
                            : item.content,
                      }}
                    />
                    <p className="text-[11px] text-[#6C6C6C]">
                      {formatDate(item.updated_at)}
                    </p>
                  </div>
                }
              />
            </Card>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[32px] font-semibold text-[#06A73B]">Events</h2>
          <Button
            style={{ width: 140, height: 48, borderRadius: 12 }}
            onClick={() => setCurrentPages("event")}
          >
            <span className="text-base text-[#232323] font-medium">
              View All Events
            </span>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {events.map((item, index) => (
            <Card
              key={index}
              hoverable
              onClick={() => navigate(`/event-news/${item.slug}`)}
              cover={
                <img
                  alt="event image"
                  src={item.image_url ? `${API_URL}/${item.image_url}` : NoImageAvailable}
                  style={{ height: 210, objectFit: "cover" }}
                />
              }
              className="transition-transform transform duration-300 ease-in-out hover:scale-[1.02]"
            >
              <Card.Meta
                title={
                  <span className="text-[15px] font-semibold">
                    {item.title}
                  </span>
                }
                description={
                  <div>
                    <div
                      className="text-xs text-[#232323] mb-12"
                      dangerouslySetInnerHTML={{
                        __html:
                          item.content.length > 100
                            ? `${item.content.substring(0, 100)}...`
                            : item.content,
                      }}
                    />
                    <p className="text-[11px] text-[#6C6C6C]">
                      {" "}
                      {formatDate(item.updated_at)}
                    </p>
                  </div>
                }
              />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllContent;
