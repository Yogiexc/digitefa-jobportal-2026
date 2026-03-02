import { useState, useEffect } from "react";
import { Card, Spin } from "antd";
import Api from "../../services/Api";
import { useNavigate } from "react-router-dom";
import NoImageAvailable from "../../assets/images/NoImage.jpg";
import '../../../src/richtexteditor.css'

const EventContent = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const API_URL = import.meta.env.VITE_IMAGE_API;
  const navigate = useNavigate();

  const fetchEvents = () => {
    Api.get(`/content/event-news?category=event`)
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching event:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const latestEvents = events.length > 0 ? events[0] : null;

  const stripHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
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
      {latestEvents && (
        <Card
          onClick={() => navigate(`/event-news/${latestEvents.slug}`)}
          hoverable
          className="relative bg-cover bg-center h-[470px] rounded-2xl overflow-hidden mb-8 transition-transform transform duration-300 ease-in-out hover:scale-[1.02]"
          style={{ width: 1150, marginBottom: "20px", position: "relative" }}
        >
          <img
            alt="news image"
            src={`${API_URL}/${latestEvents.image_url}`}
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end justify-start p-6">
            <div className="text-left text-white">
              <h1 className="text-[32px] text-[#FFF] font-bold">
                {latestEvents.title}
              </h1>
              <p className="text-[15px] text-[#F4F2FF] mt-4">
                {stripHtml(latestEvents.content).length > 100
                  ? `${stripHtml(latestEvents.content).substring(0, 200)}...`
                  : stripHtml(latestEvents.content)}
              </p>
              <p className="text-[10px] text-[#FFF] mt-4">
                {formatDate(latestEvents.updated_at)}
              </p>
            </div>
          </div>
        </Card>
      )}

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[32px] font-semibold text-[#06A73B]">
            Latest Event
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {events.slice(1).map((item, index) => (
            <Card
              style={{ height: 375, width: 210 }}
              key={index}
              hoverable
              onClick={() => navigate(`/event-news/${item.slug}`)}
              cover={
                <img
                  alt="event image"
                  src={
                    item.image_url
                      ? `${API_URL}/${item.image_url}`
                      : NoImageAvailable
                  }
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
    </div>
  );
};

export default EventContent;
