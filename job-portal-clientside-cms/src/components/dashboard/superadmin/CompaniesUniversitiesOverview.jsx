import { useEffect, useState } from "react";
import { Card, Typography, Select, Skeleton } from "antd";
import { LineChart } from '@mui/x-charts/LineChart';
import Api from "../../../services/Api";

const { Text } = Typography;

const  CompaniesUniversitiesOverview = () => {
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const handleSelectMonthChange = (value) => {
    setSelectedMonth(value);
  };

  const fetchData = async () => {
    setLoading(true);
    await Api.get(
      `/dashboard/cms/superadmin/companies-universities-overview?month=${selectedMonth}`
    )
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
  }, [selectedMonth]);

  return loading ? (
    <Card bordered={false} className="flex flex-col h-full">
      <Skeleton active />
    </Card>
  ) : (
    <Card bordered={false} className="flex flex-col">
      <div className="flex flex-col">
        <Text className="text-[16px] font-medium mb-4">Companies and Universities Overview</Text>
          <Select
            style={{width: 130, height:48}}
            defaultValue={selectedMonth}
            onChange={handleSelectMonthChange}
          >
           <Select.Option value="1">January</Select.Option>
            <Select.Option value="2">February</Select.Option>
            <Select.Option value="3">March</Select.Option>
            <Select.Option value="4">April</Select.Option>
            <Select.Option value="5">May</Select.Option>
            <Select.Option value="6">June</Select.Option>
            <Select.Option value="7">July</Select.Option>
            <Select.Option value="8">August</Select.Option>
            <Select.Option value="9">September</Select.Option>
            <Select.Option value="10">October</Select.Option>
            <Select.Option value="11">November</Select.Option>
            <Select.Option value="12">December</Select.Option>
          </Select>
        </div>
      <div className="flex-grow">
      <LineChart
      className="overflow-x-auto max-w-full"
          width={430}
          height={330}
          grid={{ horizontal: true}}
          series={[
            { curve: "linear", data: data?.companies, color: '#DC362E', label: 'Company' },
            { curve: "linear", data: data?.universities, color: '#7B110C', label: 'University' },
          ]}
          xAxis={[{ scaleType: 'point', data: data?.weeks }]}
          sx={{
            '.MuiLineElement-root': {
              strokeWidth: 2,
            },
          }}
        />
        
      </div>
    </Card>
  );
};

export default CompaniesUniversitiesOverview;