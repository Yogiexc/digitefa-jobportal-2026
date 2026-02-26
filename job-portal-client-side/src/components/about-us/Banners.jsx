import AboutUsIcon from "../../assets/svg/AboutUs.svg";
import Background from "../../assets/images/Background.jpg";

const Banners = () => {
  return (
    <div
      className="h-screen bg-cover bg-center flex flex-col items-center justify-center relative shadow"
      style={{ backgroundImage: `url(${Background})` }}
    >
      <div className="text-center mb-8 max-w-3xl px-4">
        <div className="flex items-center justify-center">
          <img
            src={AboutUsIcon}
            alt="About Us Icon"
            className="h-[60px] md:h-[60px] inline-block"
          />
        </div>
        <p className="text-[#232323] text-[18px] mt-8">
          At DIGITEFA, we are more than just a job portal; we are a community
          dedicated to professional growth and development. We invite companies,
          universities, and job seekers to join us in building a better future.
        </p>
      </div>
    </div>
  );
};

export default Banners;
