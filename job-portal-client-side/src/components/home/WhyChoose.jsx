import { Layout } from "antd";
import Logo from "../../assets/svg/Digitefaa.svg";
import JobIcon from "../../assets/svg/Job.svg";
import SearchIcon from "../../assets/svg/Search.svg";
import CompaniesIcon from "../../assets/svg/Companies.svg";
import ExperienceIcon from "../../assets/svg/Experience.svg";

const WhyChoose = () => {
  return (
    <Layout className="bg-white px-2 md:px-12 py-24">
      <div className="text-center mb-12">
        <h2 className="text-2xl text-[24px] md:text-[48px] font-medium">
          Why Choose
          <span className="inline-block mx-2">
          <img src={Logo} alt="Digitefa Logo" className="inline w-[96px] md:w-auto md:h-auto md:ml-2" />
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 px-4">
        <div className="flex flex-col items-center p-6 border border-[#D8D8D8] rounded-[15px]">
          <img src={JobIcon} alt="Extensive Job Listing" className="w-[82px] mb-4" />
          <h3 className="text-xl md:text-[26px] text-center font-medium mb-4">Extensive Job Listing</h3>
          <p className="text-xs md:text-[13px] text-center text-black md:px-12">
            Access thousands of job opportunities across various industries,
            ensuring you find the perfect match for your skills and aspirations.
          </p>
        </div>

        <div className="flex flex-col items-center p-6 border border-[#D8D8D8] rounded-[15px]">
          <img src={SearchIcon} alt="Advanced Search Features" className="w-[82px] mb-4" />
          <h3 className="text-xl md:text-[26px] text-center font-medium mb-4">Advanced Search Features</h3>
          <p className="text-xs md:text-[13px] text-center text-black md:px-12">
            Utilize our powerful search tools to filter and find jobs that meet
            your specific criteria quickly and efficiently.
          </p>
        </div>

        <div className="flex flex-col items-center p-6 border border-[#D8D8D8] rounded-[15px]">
          <img src={CompaniesIcon} alt="Top Companies" className="w-[82px] mb-4" />
          <h3 className="text-xl md:text-[26px] text-center font-medium mb-4">Top Companies</h3>
          <p className="text-xs md:text-[13px] text-center text-black md:px-12">
            Connect with reputable companies and explore exciting career
            opportunities that can propel your professional growth.
          </p>
        </div>

        <div className="flex flex-col items-center p-6 border border-[#D8D8D8] rounded-[15px]">
          <img src={ExperienceIcon} alt="Personalized Experience" className="w-[82px] mb-4" />
          <h3 className="text-xl md:text-[26px] text-center font-medium mb-4">Personalized Experience</h3>
          <p className="text-xs md:text-[13px] text-center text-black md:px-12">
            Receive tailored job recommendations and career advice to help you
            make informed decisions and advance your career with confidence.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default WhyChoose;
