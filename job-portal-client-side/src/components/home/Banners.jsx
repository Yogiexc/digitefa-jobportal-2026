import { useMediaQuery } from "react-responsive";
import Search from "../Search";
import SearchMobile from "../SearchMobile";
import Background from "../../assets/images/Background.jpg";
import Model from "../../assets/images/Wanita.png";
import Logo from "../../assets/svg/Digitefaa.svg";

const Banners = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <div
      className="h-screen bg-cover bg-center flex items-center relative shadow"
      style={{ backgroundImage: `url(${Background})` }}
    >
      <div className="mt-10 md:mt-0 w-full flex flex-col md:flex-row justify-between items-center px-7 md:px-16">
        <div className="text-center md:text-left">
          <p className="text-2xl md:text-5xl font-medium">
            Find Your Dream Job
            <span className="inline-block">
              Through
              <img
                src={Logo}
                alt="Digitefa Logo"
                className="inline ml-2 w-24 md:w-56"
              />
            </span>
          </p>

          <div className="text-xs md:text-xl mb-6">
            <p>Empowering job seekers with comprehensive</p>
            <p>resources and opportunities.</p>
          </div>

          {!isMobile && <Search />}
        </div>

        <img
          src={Model}
          alt="Model"
          className="h-[300px] w-[200px] md:h-[500px] md:w-[340px]"
        />

        {isMobile && (
          <div className="mt-4 w-full flex justify-center mb-32 sm:mb-24 md:mb-0">
            <SearchMobile />
          </div>
        )}
      </div>
    </div>
  );
};

export default Banners;
