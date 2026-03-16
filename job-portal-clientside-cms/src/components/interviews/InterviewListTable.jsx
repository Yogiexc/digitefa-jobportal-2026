import { useState, useEffect, useCallback } from "react";
import { Table, Input, App } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Api from "../../services/Api";
import Pagination from "../Pagination";

const InterviewListTable = () => {
  const { message } = App.useApp();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const API_URL = import.meta.env.VITE_IMAGE_API;

  const fetchInterviews = useCallback((page = 1, forceRefresh = false) => {
    setLoading(true);
    Api.get(`/jobs/company/interviews`, {
      params: {
        page: page,
        limit: pageSize,
        search: searchQuery,
      },
    })
      .then((res) => {
        setInterviews(res.data);
        setTotalItems(res.meta.total);
        setCurrentPage(parseInt(res.meta.page));
      })
      .catch((err) => {
        message.error("Failed to fetch interviews.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pageSize, searchQuery, message]);

  useEffect(() => {
    fetchInterviews(currentPage);
  }, [fetchInterviews, currentPage]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Job Title",
      dataIndex: "job_title",
      key: "job_title",
      render: (_, record) => record.application?.job?.title || "N/A",
    },
    {
      title: "Candidate Name",
      dataIndex: "candidate_name",
      key: "candidate_name",
      render: (_, record) => record.application?.job_seeker?.full_name || "N/A",
    },
    {
      title: "Interview Date",
      dataIndex: "interview_date",
      key: "interview_date",
      render: (date) => new Date(date).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    },
    {
      title: "Meeting Link/Location",
      dataIndex: "meeting_link",
      key: "meeting_link",
      render: (link) => link ? (link.startsWith('http') ? <a href={link} target="_blank" rel="noopener noreferrer">Join Meeting</a> : link) : "TBD",
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative mt-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Scheduled Interviews</h2>
        <Input
          placeholder="Search Candidate Name"
          value={searchQuery}
          onChange={handleSearch}
          prefix={<SearchOutlined />}
          style={{ width: 250, height: 40, borderRadius: 8 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={interviews}
        loading={loading}
        rowKey={(record) => record.interview_id}
        pagination={false}
      />

      <div className="mt-4 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default InterviewListTable;
