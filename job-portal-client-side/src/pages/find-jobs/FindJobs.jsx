import { Layout } from "antd";
import Navbar from "../../components/Navbar";
import Banners from "../../components/find-jobs/Banners";
import Filter from "../../components/find-jobs/Filter";
import JobList from "../../components/find-jobs/JobList";
import Footers from "../../components/Footers";
import { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";

const FindJobs = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "",
    sortBy: "most_recent",
    employmentType: [],
    salaryType: [],
    minimumSalary: "",
    maximumSalary:"",
    category: [],
    educationLevel: [],
    experienceLevel: [],
  });

  useEffect(() => {
    handleFilterChange({
      search: searchParams.get("search") || "",
      location: searchParams.get("location") || "",
    });
  }, [searchParams]);

  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };
  return (
    <HelmetProvider>
      <Helmet>
        <title>Find Jobs - Digitefa</title>
        <meta name="description" content="Digitefa" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Helmet>
      <Layout>
        <div className="bg-white">
          <Navbar />
          <Banners filters={filters} onFilterChange={handleFilterChange} />
          <div className="flex flex-col items-center lg:flex-row lg:items-start lg:space-x-7">
            <div className="w-full lg:w-1/4 mb-0 flex justify-center lg:justify-start">
              <div className="w-full max-w-md lg:max-w-none">
                <Filter filters={filters} onFilterChange={handleFilterChange} />
              </div>
            </div>
            <div className="lg:w-3/4 w-full" id="job-list">
              <JobList filters={filters} />
            </div>
          </div>
          <Footers />
        </div>
      </Layout>
    </HelmetProvider>
  );
};

export default FindJobs;
