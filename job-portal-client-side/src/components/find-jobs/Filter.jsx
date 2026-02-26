import { useEffect, useState } from "react";
import { Checkbox, Collapse, InputNumber, message, Radio } from "antd";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

const { Panel } = Collapse;

const detailOptions = [
  { value: "personal_summary", label: "By Personal Summary" },
  { value: "skills", label: "By Skills" },
  { value: "projects", label: "By Projects" },
  { value: "experience", label: "By Experience" },
  { value: "education", label: "By Education" },
  { value: "certifications", label: "By Certifications" },
  { value: "lms", label: "By LMS Course" },
];

const Filter = ({ filters, onFilterChange }) => {
  const [isMobileView, setIsMobileView] = useState(false);
  const [showMRDetails, setShowMRDetails] = useState(false);
  const userData = useState(JSON.parse(localStorage.getItem("userData")));
  const lmsUserId = userData[0]?.lmsUserId;
  useEffect(() => {
    setShowMRDetails(filters.sortBy === "most_relevant");
  }, [filters.sortBy]);

  const handleSortByChange = ({ target: { value } }) => {
    if (value === "most_relevant") {
      onFilterChange({
        sortBy: value,
        recommendationSort: detailOptions
          .filter((opt) => opt.value !== "lms" || !!lmsUserId)
          .map((opt) => opt.value),
      });
    } else {
      onFilterChange({ sortBy: value, recommendationSort: [] });
    }
  };

  const handleEmploymentTypeChange = (checkedValues) => {
    onFilterChange({ employmentType: Array.from(new Set(checkedValues)) });
  };

  const handleSalaryTypeChange = (checkedValues) => {
    onFilterChange({ salaryType: Array.from(new Set(checkedValues)) });
  };

  const handleMinimumSalary = (value) => {
    onFilterChange({ minimumSalary: value });
  };

  const handleMaximumSalary = (value) => {
    onFilterChange({ maximumSalary: value });
  };

  const handleCategoryChange = (checkedValues) => {
    onFilterChange({ category: checkedValues });
  };

  const handleEducationLevelChange = (checkedValues) => {
    onFilterChange({ educationLevel: checkedValues });
  };

  const handleMRDetailChange = (checkedValues) => {
    if (checkedValues.length === 0) {
      // misal pakai Antd message
      message.destroy();
      message.warning("Pilih Minimal Satu Kriteria Rekomendasi");
      return;
    }
    onFilterChange({
      sortBy: "most_relevant",
      recommendationSort: checkedValues,
    });
  };

  const toggleMobileView = () => {
    setIsMobileView(!isMobileView);
  };

  return (
    <div
      className={`py-4 px-4 sm:py-8 sm:px-8 md:py-16 md:px-16 bg-white lg:min-w-[400px]`}
    >
      <div className="container mx-auto">
        <div className="block lg:hidden mb-4">
          <button
            onClick={toggleMobileView}
            className="w-full py-2 px-4 bg-green-500 text-white rounded-md"
          >
            {isMobileView ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <Collapse
          defaultActiveKey={["1", "2", "3", "4", "5", "6"]}
          expandIcon={({ isActive }) =>
            isActive ? (
              <ChevronUpIcon className="size-4" />
            ) : (
              <ChevronDownIcon className="size-4" />
            )
          }
          expandIconPosition="end"
          style={{ background: "#fff" }}
          className={`${isMobileView ? "block" : "hidden"} lg:block`}
        >
          <Panel header="Sort By" key="1">
            <div style={{ maxHeight: 300, overflowY: "auto" }}>
              <div className="flex items-center mb-2">
                <Radio.Group
                  onChange={handleSortByChange}
                  value={filters.sortBy}
                  disabled={!userData[0]}
                  className="flex space-x-2"
                >
                  <Radio value="most_relevant">Most Relevant</Radio>
                </Radio.Group>
              </div>

              {filters.sortBy === "most_relevant" && showMRDetails && (
                <div className="ml-6 mb-4">
                  <Checkbox.Group
                    options={detailOptions.map((opt) => ({
                      label: opt.label,
                      value: opt.value,
                      disabled: !lmsUserId && opt.value === "lms",
                    }))}
                    value={filters.recommendationSort || []}
                    onChange={handleMRDetailChange}
                    className="flex flex-col space-y-2"
                  />
                </div>
              )}

              <div className="flex items-center mb-2">
                <Radio.Group
                  onChange={handleSortByChange}
                  value={filters.sortBy}
                  disabled={!userData[0]}
                  className="flex flex-col space-y-2"
                >
                  <Radio value="most_recent">Most Recent</Radio>
                </Radio.Group>
              </div>
            </div>
          </Panel>
          <Panel header="Employment Type" key="2">
            <div style={{ maxHeight: 135, overflowY: "auto" }}>
              <Checkbox.Group
                onChange={handleEmploymentTypeChange}
                value={filters.employmentType}
                className="flex flex-col"
              >
                <div className="flex items-center mb-2">
                  <Checkbox value="full_time" className="mr-2" /> Full Time
                </div>

                <div className="flex items-center mb-2">
                  <Checkbox value="freelance" className="mr-2" /> Freelance
                </div>

                <div className="flex items-center mb-2">
                  <Checkbox value="internship" className="mr-2" /> Internship
                </div>
              </Checkbox.Group>
            </div>
          </Panel>

          <Panel header="Salary" key="3">
            <Checkbox.Group
              onChange={handleSalaryTypeChange}
              value={filters.salaryType}
            >
              <Checkbox
                value="monthly_based"
                className="flex items-center mb-2"
              >
                Monthly Based
              </Checkbox>

              <Checkbox
                value="project_based"
                className="flex items-center mb-2"
              >
                Project Based
              </Checkbox>
            </Checkbox.Group>
            <div className="grid grid-cols-2 gap-2">
              <InputNumber
                className="h-12 w-full rounded-xl text-center flex items-center justify-center"
                placeholder="Min Salary"
                min={0}
                onChange={handleMinimumSalary}
              />
              <InputNumber
                className="h-12 w-full rounded-xl text-center flex items-center justify-center"
                placeholder="Max Salary"
                min={0}
                onChange={handleMaximumSalary}
              />
            </div>
          </Panel>

          <Panel header="Job Categories" key="4">
            <Checkbox.Group
              onChange={handleCategoryChange}
              value={filters.category}
            >
              <div
                style={{ maxHeight: 135, overflowY: "auto" }}
                className="custom-scrollbar w-full"
              >
                <div className="flex items-center mb-2">
                  <Checkbox
                    className="mr-2"
                    value="information_and_communication_technology"
                  />
                  Information and Communication Technology
                </div>

                <div className="flex items-center mb-2">
                  <Checkbox className="mr-2" value="finance_and_insurance" />
                  Finance and Insurance
                </div>

                <div className="flex items-center mb-2">
                  <Checkbox
                    className="mr-2"
                    value="human_resources_and_administration"
                  />
                  Human Resources and Administration
                </div>

                <div className="flex items-center mb-2">
                  <Checkbox className="mr-2" value="sales_and_marketing" />
                  Sales and Marketing
                </div>

                <div className="flex items-center mb-2">
                  <Checkbox
                    className="mr-2"
                    value="healthcare_and_social_assistance"
                  />
                  Healthcare and Social Assistance
                </div>

                <div className="flex items-center mb-2">
                  <Checkbox className="mr-2" value="education_and_training" />
                  Education and Training
                </div>

                <div className="flex items-center mb-2">
                  <Checkbox className="mr-2" value="manufacturing" />
                  Manufacturing
                </div>

                <div className="flex items-center mb-2">
                  <Checkbox className="mr-2" value="construction" />
                  Construction
                </div>

                <div className="flex items-center mb-2">
                  <Checkbox
                    className="mr-2"
                    value="arts_entertainment_and_media"
                  />
                  Arts, Entertainment, and Media
                </div>

                <div className="flex items-center mb-2">
                  <Checkbox className="mr-2" value="hospitality_and_tourism" />
                  Hospitality and Tourism
                </div>

                <div className="flex items-center mb-2">
                  <Checkbox
                    className="mr-2"
                    value="transportation_and_logistics"
                  />
                  Transportation and Logistics
                </div>

                <div className="flex items-center mb-2">
                  <Checkbox
                    className="mr-2"
                    value="public_administration_and_government"
                  />
                  Public Administration and Government
                </div>

                <div className="flex items-center mb-2">
                  <Checkbox className="mr-2" value="retail" /> Retail
                </div>

                <div className="flex items-center mb-2">
                  <Checkbox className="mr-2" value="legal" /> Legal
                </div>

                <div className="flex items-center mb-2">
                  <Checkbox className="mr-2" value="science_and_research" />
                  Science and Research
                </div>
              </div>
            </Checkbox.Group>
          </Panel>

          <Panel header="Education Level" key="5">
            <div
              style={{ maxHeight: 135, overflowY: "auto" }}
              className="custom-scrollbar w-full"
            >
              <Checkbox.Group
                onChange={handleEducationLevelChange}
                value={filters.educationLevel}
              >
                <div className="flex items-center mb-2">
                  <Checkbox className="mr-2" value="elementary_school" />
                  Elementary School
                </div>

                <div className="flex items-center mb-2">
                  <Checkbox className="mr-2" value="middle_school" /> Middle
                  School
                </div>

                <div className="flex items-center mb-2">
                  <Checkbox className="mr-2" value="high_school" /> High School
                </div>

                <div className="flex items-center mb-2">
                  <Checkbox className="mr-2" value="associate_degree" />
                  Associate Degree
                </div>

                <div className="flex items-center mb-2">
                  <Checkbox className="mr-2" value="bachelor_degree" /> Bachelor
                  Degree
                </div>

                <div className="flex items-center mb-2">
                  <Checkbox className="mr-2" value="master_degree" /> Master
                  Degree
                </div>

                <div className="flex items-center mb-2">
                  <Checkbox className="mr-2" value="doctoral_degree" /> Doctoral
                  Degree
                </div>
              </Checkbox.Group>
            </div>
          </Panel>

          {/* <Panel header="Experience Level" key="6">
            <Checkbox.Group
              onChange={handleExperienceLevelChange}
              value={filters.experienceLevel}
            >
              <div style={{ maxHeight: 135, overflowY: "auto" }}>
                <div className="flex items-center mb-2">
                  <Checkbox className="mr-2" value="entry_level" /> Entry Level
                </div>

                <div className="flex items-center mb-2">
                  <Checkbox className="mr-2" value="mid_level" /> Mid Level
                </div>

                <div className="flex items-center mb-2">
                  <Checkbox className="mr-2" value="senior_level" /> Senior
                  Level
                </div>

                <div className="flex items-center mb-2">
                  <Checkbox className="mr-2" value="executive_level" />
                  Executive Level
                </div>
              </div>
            </Checkbox.Group>
          </Panel> */}
        </Collapse>
      </div>
    </div>
  );
};

export default Filter;
