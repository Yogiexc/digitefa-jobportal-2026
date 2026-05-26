import { useState } from "react";
import { Layout, message } from "antd";
import Navbar from "../../components/Navbar";
import Banners from "../../components/profile/edit-profile/Banners";
import Footers from "../../components/Footers";
import Profiles from "../../components/profile/description-profile/Profiles";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Api from "../../services/Api";
import { useOnMountUnsafe } from "../../hooks/useMountUnsave.jsx";
import { getUserSession } from "../../utils";

const Profile = () => {
  const [personalInfo, setPersonalInfo] = useState();
  const getUserInfo = async () => {
    try {
      const user = await getUserSession();
      let profile = {};
      if (user.role === "job_seeker") {
        const { data } = await Api.get("/profile/job-seeker/personal-info");
        profile = data;
      }
      setPersonalInfo({ user, profile });
    } catch (error) {
      message.error(error);
    }
  };

  const onSubmit = async (values) => {
    try {
      await Api.put("/profile/job-seeker/personal-info", values);
      getUserInfo();
    } catch (error) {
      console.log("updatePersonalInfo :", error);
      throw error;
    }
  };

  const onUploadImage = async (options) => {
    const { file } = options;
    try {
      const formData = new FormData();
      formData.append("profile_picture", file);

      await Api.post("/profile/job-seeker/profile-picture", formData, {
        headers: { "content-type": "multipart/form-data" },
      });
      getUserInfo();
    } catch (error) {
      console.log("uploadImageProfile :", error);
      throw error;
    }
  };

  const onRemoveImage = async () => {
    try {
      await Api.delete("/profile/job-seeker/profile-picture");
      getUserInfo();
    } catch (error) {
      console.log("removeImageProfile :", error);
      throw error;
    }
  };

  /**
   * @method useOnMountUnsafe
   * @description this hook handle useEffect called twice
   */
  useOnMountUnsafe(getUserInfo);

  return (
    <HelmetProvider>
      <Helmet>
        <title>Digitefa</title>
        <meta name="description" content="Digitefa" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Helmet>
      <Layout>
        <Navbar />
        <Banners
          {...personalInfo}
          onSubmit={onSubmit}
          onUploadImage={onUploadImage}
          onRemoveImage={onRemoveImage}
        />
        <Profiles onAutofillSuccess={getUserInfo} />
        <Footers />
      </Layout>
    </HelmetProvider>
  );
};

export default Profile;
