import { useMediaQuery } from "react-responsive";
import Search from "../Search";
import SearchMobile from "../SearchMobile";
import Logo from "../../assets/svg/Digitefaa.svg";
import Background from "../../assets/images/Background.jpg";

const Banners = ({ filters, onFilterChange }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  return (
    <div
      className="h-screen bg-cover bg-center flex flex-col items-center justify-center relative shadow"
      style={{ backgroundImage: `url(${Background})` }}
    >
      <div className="text-center mb-8">
        <p className="text-xl md:text-2xl">
          Discover your next career move with
          <span className="inline-block mx-2">
            <img src={Logo} alt="Digitefa Logo" className="h-[20px] md:h-[24px] inline" />,
          </span>
          where thousands of job
          <p> opportunities await you. Start your journey today!</p>
        </p>
      </div>
      {!isMobile && (
        <Search filters={filters} onFilterChange={onFilterChange} />
      )}
      {isMobile && (
        <div className="mt-4 w-full flex justify-center">
          <SearchMobile />
        </div>
      )}
    </div>
  );
};

export default Banners;
