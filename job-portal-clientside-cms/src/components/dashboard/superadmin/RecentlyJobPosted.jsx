import { useState, useEffect } from "react";
import { Card, Typography, Table } from "antd";
import Api from "../../../services/Api";

const { Text } = Typography;

const RecentlyJobPosted = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "No",
      key: "no",
      width: "5%",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Company Name",
      render: (text, record) => record.company.legal_name,
      dataIndex: "legal_name",
      width: "30%",
    },
    {
      title: "Job Title",
      key: "title",
      dataIndex: "title",
      width: "30%",
    },
    {
      title: "Date Posted",
      key: "published_at",
      dataIndex: "published_at",

      render: (text) => {
        const formatDate = (dateString) => {
          const date = new Date(dateString);
          const day = date.getDate();
          const month = date.toLocaleString("en-US", { month: "long" });
          const year = date.getFullYear();
          return `${day} ${month} ${year}`;
        };
        return formatDate(text)
      
      },
      width: "20%",
    },
  ];

  const fetchData = (shouldFetchData) => {
    if (shouldFetchData) {
      setLoading(true);
      Api
        .get("/dashboard/cms/superadmin/recent-jobs?size=5")
        .then((response) => {
          setData(response.data);
          setLoading(false);
        })
        .catch((error) => error.response);
    }
  };

  

  useEffect(() => {
    fetchData(true);
  }, []);

  return (
    <Card bordered={false} className="flex flex-col h-full">
      <Text className="text-[16px] font-medium">Recently Job Posted</Text>
      <Table
        className="mt-3 overflow-x-auto max-w-full min-h-full custom-table-dashboard"
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={true}
        loading={loading}
        rowKey={(record) => record.activity_history_id}
      />
    </Card>
  );
};

export default RecentlyJobPosted;
