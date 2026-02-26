import { useEffect, useState } from "react";
import Api from "../../services/Api";
import '../../../src/richtexteditor.css'

const PrivacyPolicyContent = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    Api.get("/content/privacy-policy")
      .then((response) => {    
        setContent(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Privacy Policy content:", error);
      });
  }, []);
  

  return (
    <div className="flex flex-col md:flex-row px-4 md:px-16 py-8 bg-white">
      <div className="flex-1">
        <div className="mb-8 flex">
          <p className="text-[32px] text-[#232323] mr-2" >This Privacy Policy will help you better understand how we collect, use, and share your personal information</p>
        </div>
        <div
          className="text-[#232323] text-[15px] mr-8"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default PrivacyPolicyContent;
