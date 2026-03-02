import {
  Button,
  Card,
  Layout,
  message,
  Skeleton,
  Slider,
  Switch,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import Api from "../../services/Api";

const { Text } = Typography;
const { Content } = Layout;

const SecureList = () => {
  const [toggleSecure, setToggleSecure] = useState();
  const [intervalSecure, setIntervalSecure] = useState(1);
  const onChangeInterval = (value) => {
    setIntervalSecure(value);
  };
  const [loading, setLoading] = useState(true);
  const marks = {
    10: "10s",
    20: "20s",
    30: "30s",
    40: "40s",
    50: "50s",
    60: "60s",
  };

  const fetchData = () => {
    Api.get(`/settings/secure-log`)
      .then((response) => {
        const { data } = response;
        setToggleSecure(data.secureLogEnabled === "true" ? true : false);
        setIntervalSecure(data.secureLogInterval);
      })
      .catch(() => {
        message.destroy();
        message.error("Error fetching Secure Log");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = () => {
    const data = {
      status: toggleSecure.toString(),
      interval: intervalSecure.toString(),
    };
    Api.post(`/settings/secure-log`, data)
      .then(() => {
        message.destroy();
        message.success("Secure Log saved successfully");
      })
      .catch(() => {
        message.destroy();
        message.error("Error saving Secure Log");
      });
  };

  if (loading) {
    return (
      <Card bordered={false} className="flex flex-col h-full">
        <Skeleton active />
      </Card>
    );
  }
  return (
    <Content className="p-6 mt-3">
      <Card bordered={false} className="flex flex-col h-full shadow-lg rounded-[20px]">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between">
            <Text className="text-[20px] font-semibold ">
              Job Applicants Realtime Log
            </Text>
            <Switch
                checkedChildren="On"
                unCheckedChildren="Off"
                value={toggleSecure}
                onChange={(val) => setToggleSecure(val)}
              />
          </div>

          <div className="flex justify-start font-[#6B5312]">
            <Text style={{ color: "#6B5312" }}>
              Monitor job applications in real-time: This panel allows
              university administrators to track job applications submitted by
              jobseekers, providing real-time insights into their career
              activities.
            </Text>
          </div>
          <div className="flex flex-col w-1/2">
            <Text className="font-medium mt-6 text-[16px]">
              Set Update Interval
            </Text>
            <Slider
              disabled={!toggleSecure}
              included={toggleSecure}
              marks={marks}
              min={10}
              max={60}
              step={10}
              onChange={onChangeInterval}
              value={intervalSecure}
            />
          </div>
          <div className="flex justify-end">
            {" "}
            <Button
              type="primary"
              style={{ width: 120, height: 40, borderRadius: 12 }}
              onClick={handleSave}
            >
              <span className="font-medium">Save</span>
            </Button>
          </div>
        </div>
      </Card>
    </Content>
  );
};

export default SecureList;
