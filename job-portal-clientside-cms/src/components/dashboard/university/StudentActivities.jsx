import { useEffect, useState } from "react";
import { Card, Typography, Select, Skeleton } from "antd";
import { LineChart } from "@mui/x-charts/LineChart";
import Api from "../../../services/Api";

const { Text } = Typography;

const StudentActivities = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    await Api.get(`/dashboard/cms/university/student-activities?year=${selectedYear}`)
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

  return loading ? (
    <Card bordered={false} className="flex flex-col h-full">
      <Skeleton active />
    </Card>
  ) : (
    <Card bordered={false} className="flex flex-col h-full">
      <div className="mb-4">
        <Text className="text-[16px] font-medium">Student Activities</Text>
      </div>
      <div className="flex justify-between items-center mb-4">
        <Select
          style={{width: 120, height: 48}}
          defaultValue={selectedYear}
          onChange={(value) => {
            setSelectedYear(value);
          }}
        >
          <Select.Option value="2024">2024</Select.Option>
        </Select>
      </div>
      <div className="flex-grow">
        <LineChart
          width={900}
          height={400}
          series={[
            {
              data: data?.totalRegistered,
              label: "Registered",
              color: "#DC362E",
            },
            { data: data?.totalEmployed, label: "Employed", color: "#7B110C" },
          ]}
          xAxis={[{ scaleType: "point", data: data?.months }]}
          yAxis={[{ min: 0, max: 300, step: 50 }]}
          sx={{
            "& .MuiTooltip-tooltip": {
              backgroundColor: "black",
              color: "white",
            },
          }}
          tooltip={{
            formatter: (params) => {
              const { label, value } = params;
              return `${label}: ${value}`;
            },
          }}
        />
      </div>
    </Card>
  );
};

export default StudentActivities;
