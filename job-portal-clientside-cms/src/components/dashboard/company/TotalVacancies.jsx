import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Typography, Skeleton } from "antd";
import Api from "../../../services/Api";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const { Text } = Typography;

const TotalVacancies = () => {
  const [loading, setLoading] = useState(false);
  const [totalVacancies, setTotalVacancies] = useState(0); 
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await Api.get("/dashboard/cms/company/total-job-vacancies");
        setTotalVacancies(response.data); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []); 

  
  function handleViewTalents() {
    navigateTo("/job-vacancy");
  }

  return loading ? (
    <Card bordered={false} className="flex flex-col h-full">
      <Skeleton active />
    </Card>
  ) : (
    <Card bordered={false} className="flex flex-col h-full">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between">          
          <Text className="text-[20px] font-semibold">Total Vacancies</Text>          
        </div>

        <div className="flex justify-start">
          <div className="flex flex-col">
            <Text className="text-[48px] font-medium">{totalVacancies}</Text> {/* Display the total vacancies */}
            <Text className="text-[14px]" style={{ color: '#9A9A9A' }}>Total vacancies opened</Text>
          </div>
        </div>
      </div>
      <div className="flex justify-start">
        <Text
          className="cursor-pointer flex items-center"
          onClick={handleViewTalents}
          style={{ color: '#6B5312' }}
        >
          Job Vacancy <ArrowRightIcon className="size-4 ml-2" />
        </Text>
      </div>
    </Card>
  );
};

export default TotalVacancies;
