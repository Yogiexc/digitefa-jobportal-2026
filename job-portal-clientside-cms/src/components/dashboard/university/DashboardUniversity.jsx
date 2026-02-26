import StudentActivities from "./StudentActivities";
import EnrolledStudents from "./EnrolledStudents";
import StudentEmploymentRatio from "./StudentsEmploymentRatio";

const DashboardUniversity = () => {
  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col lg:flex-row lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="lg:w-1/3">
          <EnrolledStudents />
        </div>
        <div className="lg:w-2/3">
          <StudentEmploymentRatio />
        </div>
      </div>
      <div>
        <StudentActivities />
      </div>
    </div>
  );
};

export default DashboardUniversity;
