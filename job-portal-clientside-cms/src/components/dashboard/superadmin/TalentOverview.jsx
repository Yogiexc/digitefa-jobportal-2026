import { useEffect, useState } from "react";
import { Card, Typography, Select, Skeleton } from "antd";
import { LineChart } from "@mui/x-charts/LineChart";
import Api from "../../../services/Api";

const { Text } = Typography;

const TalentOverview = () => {
  function getWeekOfMonth(date) {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return Math.ceil((date.getDate() + firstDay) / 7);
  }
  function getWeeksInMonth(month, year) {
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
    const lastDateOfMonth = new Date(year, month, 0).getDate();
    return Math.ceil((lastDateOfMonth + firstDayOfMonth) / 7);
  }
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentWeek = getWeekOfMonth(today);

  const [weekValue, setWeekValue] = useState(currentWeek.toString());
  const [monthValue, setMonthValue] = useState(currentMonth.toString());
  const [weekOptions, setWeekOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataTalent, setDataTalent] = useState(null);

  const handleSelectWeekChange = (value) => {
    setWeekValue(value);
  };

  const handleSelectMonthChange = (value) => {
    setWeekValue("1");
    setMonthValue(value);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      setLoading(true);
      Api.get(
        `/dashboard/cms/superadmin/talents-overview?week=${weekValue}&month=${monthValue}`
      )
        .then((response) => {
          setDataTalent(response.data);
        })
        .catch((error) => error.response)
        .finally(() => setLoading(false));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const totalWeeks = getWeeksInMonth(monthValue, today.getFullYear());
    const options = Array.from({ length: totalWeeks }, (_, i) =>
      (i + 1).toString()
    );
    setWeekOptions(options);
    fetchData();
  }, [weekValue, monthValue]);

  return loading ? (
    <Card bordered={false} className="flex flex-col h-full">
      <Skeleton active />
    </Card>
  ) : (
    <Card bordered={false} className="flex flex-col">
      <div className="flex flex-col">
        <Text className="text-[16px] font-medium mb-4">Talent Overview</Text>
        <div className="flex flex-row">
          <Select
            style={{width:100, height: 48, marginRight: 8}}
            value={weekValue}
            onChange={handleSelectWeekChange}
          >
            {weekOptions.map((week) => (
              <Select.Option key={week} value={week}>
                Week {week}
              </Select.Option>
            ))}
          </Select>
          <Select
            style={{width: 120, height:48}}
            defaultValue={monthValue}
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
      </div>
      <div className="flex-grow">
        {dataTalent ? (
          <LineChart
            className="overflow-x-auto max-w-full"
            width={430}
            height={330}
            grid={{ horizontal: true,  }}
            series={[{ curve:"linear", data: dataTalent?.talentsData, color: "#DC362E" }]}
            xAxis={[{ scaleType: "point", data: dataTalent?.label }]}
            sx={{
              ".MuiLineElement-root": {
                stroke: "#DC362E",
                fill: "url(#colorUv)",
              },
            }}
          />
        ) : (
          <Text>No data available</Text>
        )}
        <svg style={{ height: 0 }}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="20%" stopColor="#DC362E" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#DC362E" stopOpacity={0} />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </Card>
  );
};

export default TalentOverview;
