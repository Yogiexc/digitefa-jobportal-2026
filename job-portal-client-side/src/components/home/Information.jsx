import LiveJobsIcon from "../../assets/svg/LiveJobs.svg";
import VacanciesIcon from "../../assets/svg/Vacancies.svg";
import CompaniesIcon from "../../assets/svg/Companiess.svg";
import NewJobsIcon from "../../assets/svg/NewJobs.svg";

const Information = () => {
  const infoData = [
    {
      number: "3,214",
      text: "LIVE JOBS",
      description:
        "Explore Active Jobs Listings Across Various Companies and Find Your Perfect Match Today!",
      icon: LiveJobsIcon,
    },
    {
      number: "20,621+",
      text: "VACANCIES",
      description:
        "Browse Through Numerous Job Openings and Find The Right Fit for Your Career!",
      icon: VacanciesIcon,
    },
    {
      number: "2,110+",
      text: "COMPANIES",
      description:
        "Discover Top Companies and Explore Exciting Career Opportunities!",
      icon: CompaniesIcon,
    },
    {
      number: "698+",
      text: "NEW JOBS",
      description:
        "Stay Updated with The Latest Jobs Posting and Secure Your Next Opportunity Today!",
      icon: NewJobsIcon,
    },
  ];

  return (
    <div className="flex bg-white justify-center px-16 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-12">
        {infoData.map((item, index) => (
          <div
            key={index}
            className="relative h-[180px] w-[250px] border-[#F9F9F9] border md:border-[#D8D8D8] rounded-[12px] p-3 flex flex-col justify-between"
          >
            <img
              src={item.icon}
              alt={item.text}
              className="absolute top-3 right-3 w-12 h-12"
            />
            <div>
              <h2 className="text-[28px] font-semibold mb-[1px]">
                {item.number}
              </h2>
              <h3 className="text-[16px] font-medium mb-2">{item.text}</h3>
            </div>
            <p className="text-[13px] text-black">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Information;
