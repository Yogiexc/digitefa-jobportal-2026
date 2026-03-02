import { Input, Button } from "antd";
import { MagnifyingGlassIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Search = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const navigate = useNavigate();

  const handleButton = () => {
    navigate({
      pathname: "/find-jobs",
      search: `?search=${search}&location=${location}`,
    });
    setTimeout(() => {
      const element = document.getElementById("job-list");
      if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - 75;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 100);
  };
  return (
    <div
      className="flex zitems-center bg-white rounded-xl shadow-xl p-2"
      style={{ width: "700px", height: "70px" }}
    >
      <div className="relative mr-2">
        <Input
          name="search"
          placeholder="Job Title / Keyword"
          size="large"
          style={{
            width: "280px",
            height: "50px",
            fontSize: "14px",
            color: "#9A9A9A",
          }}
          className="pl-10"
          defaultValue={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>
      <div className="relative mr-2">
        <Input
          placeholder="Location"
          size="large"
          style={{
            width: "280px",
            height: "50px",
            fontSize: "14px",
            color: "#9A9A9A",
          }}
          className="pl-10"
          defaultValue={location}
          onChange={(e) => {
            setLocation(e.target.value);
          }}
        />
        <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>
      <Button
        type="primary"
        size="large"
        style={{ width: "105px", height: "50px" }}
        onClick={handleButton}
      >
        Search
      </Button>
    </div>
  );
};

export default Search;
