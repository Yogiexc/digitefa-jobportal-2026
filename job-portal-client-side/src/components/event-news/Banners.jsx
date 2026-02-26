import { Tabs, Input } from "antd";
import EventNewsIcon from "../../assets/svg/EventNews.svg";
import Background from "../../assets/images/Background.jpg";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";


const Banners = ({ currentPages, setCurrentPages }) => {
  const handleTabChange = (key) => {
    setCurrentPages(key);
  };

  const getSearchPlaceholder = () => {
    switch (currentPages) {
      case "news":
        return "Search News";
      case "event":
        return "Search Event";
      default:
        return "";
    }
  };

  const items = [
    {
      label: "All",
      key: "all",
    },
    {
      label: "News",
      key: "news",
    },
    {
      label: "Event",
      key: "event",
    },
  ];

  return (
    <div
      className="h-screen bg-cover bg-center flex flex-col justify-center relative shadow"
      style={{ backgroundImage: `url(${Background})` }}
    >
      <div className="text-center mb-8 max-w-3xl px-4 mx-auto">
        <div className="flex items-center justify-center">
          <img
            src={EventNewsIcon}
            alt="About Us Icon"
            className="h-[60px] md:h-[60px] inline-block"
          />
        </div>
        <p className="text-[#232323] text-[18px] mt-8">
          Explore our latest events and news, and join us in building a better
          future by connecting with companies, universities, and job seekers.
        </p>
      </div>

      <Tabs
        defaultActiveKey="all"
        onChange={handleTabChange}
        className="absolute left-16 bottom-4"
        items={items}
        activeKey={currentPages}
      />

      {(currentPages === "news" || currentPages === "event") && (
        <div className="absolute right-16 bottom-8">
          <div className="relative">
            <Input
              placeholder={getSearchPlaceholder()}
              className="pl-10 pr-3 py-2"
              style={{ width: 250, height: 48, borderRadius: "12px" }}
            />
            <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-[#06A73B]" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Banners;
