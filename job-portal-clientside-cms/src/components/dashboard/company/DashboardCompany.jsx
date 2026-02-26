import TotalVacancies from "./TotalVacancies";
import JobOverview from "./JobOverview";
import TalentsAcceptanceRatio from "./TalentsAcceptanceRatio";

const DashboardCompany = () => {
  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col lg:flex-row lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="lg:w-2/3">
          <TalentsAcceptanceRatio />
        </div>
        <div className="lg:w-1/3">
        <TotalVacancies />
        </div>
      </div>
      <div>
        <JobOverview />
      </div>
    </div>
  );
};

export default DashboardCompany;
