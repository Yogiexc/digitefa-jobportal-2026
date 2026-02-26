import { createContext, useContext, useState } from "react";

const JobApplyContext = createContext();

export const JobApplyProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    upload_resume: null,
    expected_salary: null,
    experience_years: null,
  });

  const updateFormData = (step, data) => {
    setFormData((prevData) => ({
      ...prevData,
      [step]: data,
    }));
  };

  return (
    <JobApplyContext.Provider value={{ formData, updateFormData }}>
      {children}
    </JobApplyContext.Provider>
  );
};

export const useJobApply = () => {
  return useContext(JobApplyContext);
};
