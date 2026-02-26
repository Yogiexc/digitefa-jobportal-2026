import { useState, useEffect } from "react";
import { Card, Typography, Skeleton, Select } from "antd";
import { BarChart } from "@mui/x-charts/BarChart";
import Api from "../../../services/Api";

const { Text } = Typography;
const { Option } = Select;

const JobOverview = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchData = async () => {
    setLoading(true);
    await Api.get(`/dashboard/cms/company/job-overview?year=${selectedYear}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [selectedYear]);

  const barSeries = [
    {
      data: data.map((item) => item.totalVacancies),
      stack: "stack1",
      label: "Vacancy",
      color: "#FEF3F2",
    },
    {
      data: data.map((item) => item.totalApplicants),
      stack: "stack1",
      label: "Applicant",
      color: "#FECCCA",
    },
    {
      data: data.map((item) => item.totalAccepted),
      stack: "stack1",
      label: "Accepted",
      color: "#DC362E",
    },
  ];

  const xAxis = [
    {
      scaleType: "band",
      data: data.map((item) => item.label),
    },
  ];

  const yAxis = [
    {
      min: 0,
      max: 100,
    },
  ];

  return (
    <Card bordered={false} className="flex flex-col h-full">
      {loading ? (
        <Skeleton active />
      ) : (
        <div className="flex flex-col space-y-2">
          <div className="mb-4">
            <Text className="text-[16px] font-medium">Job Overview</Text>
            <div className="flex justify-between items-center mt-4">
            <Select
              defaultValue={selectedYear}
              style={{width: 120, height: 48}}
              onChange={(value) => {
                setSelectedYear(value);
              }}
            >
              <Option value="2024">2024</Option>
            </Select>
            </div>
          </div>
          <BarChart
            series={barSeries}
            xAxis={xAxis} 
            width={800}
            height={400}
            yAxis={yAxis}
            barTooltip={(item) => (
              <div className="p-2 bg-black text-white rounded">
                <div>Vacancy: {item.data.totalVacancies}</div>
                <div>Applicant: {item.data.totalApplicants}</div>
                <div>Accepted: {item.data.totalAccepted}</div>
              </div>
            )}
          />
        </div>
      )}
    </Card>
  );
};

export default JobOverview;
