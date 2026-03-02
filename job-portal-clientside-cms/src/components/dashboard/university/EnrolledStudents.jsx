import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Typography, Skeleton } from "antd";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Api from "../../../services/Api";

const { Text } = Typography;

const EnrolledStudents = () => {
  const [loading, setLoading] = useState(true);
  const navigateTo = useNavigate();
  const [data, setData] = useState();

  const fetchData = async () => {
    setLoading(true);
    await Api.get(`/dashboard/cms/university/enrolled-students`)
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
  }, []);

  function handleViewTalents() {
    navigateTo("/registered-student");
  }
  return loading ? (
    <Card bordered={false} className="flex flex-col h-full">
      <Skeleton active />
    </Card>
  ) : (
    <Card bordered={false} className="flex flex-col h-full">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between">
          <Text className="text-[20px] font-semibold ">Enrolled Students</Text>
        </div>

        <div className="flex justify-start">
          <div className="flex flex-col">
            <Text className="text-[48px] font-medium">{data}</Text>
            <Text className="text-[14px]" style={{ color: "#9A9A9A" }}>
              Increase compared to last month
            </Text>
          </div>
        </div>
        <div className="flex justify-start font-[#6B5312]">
          <Text
            className="cursor-pointer flex items-center"
            onClick={handleViewTalents}
            style={{ color: "#6B5312" }}
          >
            Registered Students <ArrowRightIcon className="size-4 ml-2" />
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default EnrolledStudents;
