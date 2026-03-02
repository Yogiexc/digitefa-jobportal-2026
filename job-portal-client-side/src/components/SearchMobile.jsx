import { Input, Button } from "antd";
import { MagnifyingGlassIcon, MapPinIcon } from "@heroicons/react/24/outline";

const SearchMobile = () => {
  return (
    <div
      className="flex flex-col items-center bg-white rounded-xl shadow-xl p-4 space-y-4"
      style={{ width: "90%", maxWidth: "400px" }}
    >
      <div className="relative w-full">
        <Input
          placeholder="Job Title / Keyword"
          size="large"
          className="pl-10 bg-white border border-gray-300"
          style={{
            width: "100%",
            height: "50px",
            fontSize: "14px",
            color: "#9A9A9A",
            backgroundColor: "white",
            borderColor: "#BBBBBB",
          }}
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>
      <div className="relative w-full">
        <Input
          placeholder="Location"
          size="large"
          className="pl-10 bg-white border border-gray-300"
          style={{
            width: "100%",
            height: "50px",
            fontSize: "14px",
            color: "#9A9A9A",
            backgroundColor: "white",
            borderColor: "#BBBBBB",
          }}
        />
        <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>
      <Button
        type="primary"
        size="large"
        className="w-full"
        style={{ height: "50px" }}
      >
        Search
      </Button>
    </div>
  );
};

export default SearchMobile;
