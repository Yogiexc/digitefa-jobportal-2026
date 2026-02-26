import { useEffect, useState } from "react";
import Api from "../../services/Api";
import Logo from "../../assets/svg/Digitefaa.svg";
import '../../../src/richtexteditor.css'

const AboutUsContent = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    Api.get("/content/about-us")
      .then((response) => {
        setContent(response.data);
      })
      .catch((error) => {
        console.error("Error fetching About Us content:", error);
      });
  }, []);

  return (
    <div className="flex flex-col md:flex-row px-4 md:px-16 py-8 bg-white">
      <div className="flex-1">
        <div className="mb-8 flex items-center">
          <p className="text-2xl text-[#232323] mr-2">Welcome to</p>
          <img src={Logo} alt="Digitefa Logo" className="h-6 md:h-6" style={{ height: "24px" }} />
        </div>
        <div
          className="text-[#232323] text-[15px] mr-8"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

    </div>
  );
};

export default AboutUsContent;
