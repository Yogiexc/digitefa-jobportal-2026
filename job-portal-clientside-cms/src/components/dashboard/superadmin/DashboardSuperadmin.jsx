import Companies from "./Companies";
import Universities from "./Universities";
import Talents from "./Talents";
import TalentOverview from "./TalentOverview";
import CompaniesUniversitiesOverview from "./CompaniesUniversitiesOverview";
import RecentlyJobPosted from "./RecentlyJobPosted";

const DashboardSuperadmin = () => {
  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col lg:flex-row lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="lg:w-1/3">
          <Talents />
        </div>
        <div className="lg:w-1/3">
          <Companies />
        </div>
        <div className="lg:w-1/3">
          <Universities />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="lg:w-1/2">
          <TalentOverview />
        </div>
        <div className="lg:w-1/2">
          <CompaniesUniversitiesOverview />
        </div>
      </div>
      <div>
        <RecentlyJobPosted />
      </div>
    </div>
  );
};

export default DashboardSuperadmin;
