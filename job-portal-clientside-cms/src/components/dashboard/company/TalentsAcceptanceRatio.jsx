import { useState } from "react";
import { Card, Typography, Progress, Skeleton } from "antd";
import Api from "../../../services/Api";
import { useEffect } from "react";

const { Text } = Typography;

const TalentsAcceptanceRatio = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    await Api.get(
      `/dashboard/cms/company/talents-acceptance-ratio`
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
  }, []);

  return loading ? (
    <Card bordered={false} className="flex flex-col h-full">
      <Skeleton active />
    </Card>
  ) : (
    <Card bordered={false} className="flex flex-col h-full">
      <div className="flex flex-col">
        <Text className="text-[20px] font-semibold ">
          Talents Acceptance Ratio
        </Text>
        <Text className="text-[48px] font-medium mb-2">{data?.ratio}%</Text>
        <Progress
          percent={data?.ratio}
          showInfo={false}
          strokeColor="#DC362E"
          trailColor="#FECCCA"
          size={{ strokeWidth: 12 }}
        />
        <div className="flex justify-end mt-2">
          <Text className="text-[14px]" style={{ color: "#9A9A9A" }}>
          {data?.total_accepted} Out of {data?.total_applicants} Talents have been accepted
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default TalentsAcceptanceRatio;
