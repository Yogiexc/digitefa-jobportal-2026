import { useState, useEffect } from "react";
import { Button } from "antd";
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  PencilSquareIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { previewImageUrl } from "../../../utils";
import PersonalInformation from "../../profile/edit-profile/PersonalInformation";
import Background from "../../../assets/images/Background.jpg";
import NoImageAvailable from "../../../assets/images/broken.jpg";

const Banners = ({ user, profile, onSubmit, onUploadImage, onRemoveImage }) => {
  const [openPersonalInformation, setOpenPersonalInformation] = useState(false);

  const imageUrl = previewImageUrl({
    patch: "LOGO",
    url_image: profile?.profile_picture_url || user?.profile_picture_url,
  });

  const [imgSrc, setImgSrc] = useState(imageUrl || NoImageAvailable);

  useEffect(() => {
    setImgSrc(imageUrl || NoImageAvailable);
  }, [imageUrl]);

  const formatDateOfBirth = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const formattedDateOfBirth = formatDateOfBirth(profile?.date_of_birth);

  return (
    <>
      <div
        className="px-4 sm:px-10 md:px-[160px] h-[295px] flex flex-col md:flex-row items-center justify-between p-6 bg-cover bg-center"
        style={{ backgroundImage: `url(${Background})` }}
      >
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <img
            src={imgSrc}
            alt="Profile"
            onError={() => setImgSrc(NoImageAvailable)}
            className="w-[150px] h-[150px] md:w-[195px] md:h-[195px] rounded-full bg-gray-200 object-cover flex items-center justify-center"
          />

          <div className="space-y-1 md:space-y-2">
            <h1 className="text-[24px] md:text-[32px] font-medium">{profile?.full_name || user?.full_name}</h1>
            <div className="flex items-center space-x-2">
              <EnvelopeIcon className="size-5 text-[#232323]" />
              <span className="text-xs font-medium">{profile?.email || user?.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <PhoneIcon className="size-5 text-[#232323]" />
              <span className="text-xs font-medium">
                {profile?.phone_number ? profile?.phone_number : "-"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="size-5 text-[#232323]" />
              <span className="text-xs font-medium">
                {profile?.date_of_birth && formattedDateOfBirth !== "-" ? formattedDateOfBirth : "-"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPinIcon className="size-5 text-[#232323]" />
              <span className="text-xs">
                {profile?.address ? profile?.address : "-"}
              </span>
            </div>
          </div>
        </div>
        <Button
          type="default"
          icon={<PencilSquareIcon className="size-4" />}
          className="mt-4 md:mt-0 w-[120px] h-[40px] border-green-600 text-green-600 rounded-[12px] hover:bg-green-600 hover:text-white"
          onClick={() => setOpenPersonalInformation(true)}
        >
          <span className="text-[#06A73B] text-[14px] font-medium"> Edit </span>
        </Button>
      </div>
      <PersonalInformation
        onSubmit={onSubmit}
        onUploadImage={onUploadImage}
        onRemoveImage={onRemoveImage}
        open={openPersonalInformation}
        setOpen={setOpenPersonalInformation}
        initialValues={{ ...user, ...profile, imageUrl }}
      />
    </>
  );
};

export default Banners;
