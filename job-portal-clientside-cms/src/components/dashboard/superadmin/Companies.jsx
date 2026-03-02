import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Typography, Select, Skeleton } from "antd";
import Api from "../../../services/Api";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const { Text } = Typography;

const Companies = () => {
  const [alignValue, setAlignValue] = useState("week");
  const [loading, setLoading] = useState(false);
  const navigateTo = useNavigate();
  const [items, setItems] = useState([
    {
      key: "week",
      label: "Week",
      data: 0,
    },
    {
      key: "month",
      label: "Month",
      data: 0,
    },
    {
      key: "all-time",
      label: "All Time",
      data: 0,
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const weekResponse = await Api.get(
          "/dashboard/cms/superadmin/total-companies?time=week"
        );
        const monthResponse = await Api.get(
         "/dashboard/cms/superadmin/total-companies?time=month"
        );
        const allTimeResponse = await Api.get(
          "/dashboard/cms/superadmin/total-companies?time=all-time"
        );

        setItems([
          {
            key: "week",
            label: "Week",
            data: weekResponse.data,
          },
          {
            key: "month",
            label: "Month",
            data: monthResponse.data,
          },
          {
            key: "all-time",
            label: "All Time",
            data: allTimeResponse.data,
          },
        ]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleSelectChange = (value) => {
    setAlignValue(value);
  };

  function handleViewTalents() {
    navigateTo("/company-management");
  }
  
  return loading ? (
    <Card bordered={false} className="flex flex-col h-full">
      <Skeleton active />
    </Card>
  ) : (
    <Card bordered={false} className="flex flex-col h-full">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between">          
            <Text className="text-[20px] font-semibold ">Companies</Text>
          <div className="w-1/2 flex justify-end">
            <Select
              className="w-[120px] h-[40px] "
              defaultValue="week"
              onChange={handleSelectChange}
            >          
              <Select.Option value="week">Week</Select.Option>
              <Select.Option value="month">Month</Select.Option>
              <Select.Option value="all-time">All Time</Select.Option>
            </Select>
          </div>
        </div>

        <div className="flex justify-start">
          {items.map((item) =>
            alignValue === item.key ? (
              <div key={item.key}>
                <div className="flex flex-col">
                  <Text className="text-[48px] font-medium">{item.data}</Text>
                  <Text className="text-[14px]" style={{ color: '#9A9A9A' }}>Total companies registered</Text>
                </div>
              </div>
            ) : null
          )}
        </div>
      <div className="flex justify-start font-[#6B5312]">
          <Text
            className="cursor-pointer flex items-center"
            onClick={handleViewTalents}
            style={{ color: '#6B5312' }}
          >
            Company Management <ArrowRightIcon className="size-4 ml-2" />
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default Companies;
