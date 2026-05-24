import { useState, useEffect, useCallback } from "react";
import { Table, Input, App, Button, Modal, Tag, Dropdown } from "antd";
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleFilled,
  DownOutlined,
} from "@ant-design/icons";
import Api from "../../services/Api";
import Pagination from "../Pagination";

const InterviewListTable = () => {
  const { message, modal } = App.useApp();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchInterviews = useCallback(
    (page = 1) => {
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
        .catch(() => {
          message.error("Failed to fetch interviews.");
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [pageSize, searchQuery, message]
  );

  useEffect(() => {
    fetchInterviews(currentPage);
  }, [fetchInterviews, currentPage]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (record, newStatus) => {
    const statusLabel = newStatus === "accepted" ? "Accept" : "Reject";
    const candidateName =
      record.application?.job_seeker?.full_name || "this candidate";

    modal.confirm({
      title: `${statusLabel} Candidate`,
      icon: <ExclamationCircleFilled />,
      content: `Are you sure you want to ${statusLabel.toLowerCase()} ${candidateName}?`,
      okText: `Yes, ${statusLabel}`,
      okType: newStatus === "accepted" ? "primary" : "danger",
      cancelText: "Cancel",
      centered: true,
      onOk() {
        setActionLoading(record.interview_id);
        return Api.put(
          `/jobs/applicants/change-status/${record.application_id}`,
          { status: newStatus }
        )
          .then(() => {
            message.success(
              `Candidate ${newStatus === "accepted" ? "accepted" : "rejected"} successfully.`
            );
            fetchInterviews(currentPage);
          })
          .catch((error) => {
            message.error(
              error?.data?.message || "Failed to update status."
            );
          })
          .finally(() => {
            setActionLoading(null);
          });
      },
    });
  };

  const getStatusTag = (record) => {
    const status = record.application?.status;
    if (status === "accepted") {
      return <Tag color="green">Accepted</Tag>;
    }
    if (status === "rejected") {
      return <Tag color="red">Rejected</Tag>;
    }
    return <Tag color="blue">Waiting Interview</Tag>;
  };

  const getActionItems = (record) => {
    const status = record.application?.status;
    if (status === "accepted" || status === "rejected") {
      return [];
    }
    return [
      {
        key: "accepted",
        label: "Accept",
        icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
        onClick: () => handleStatusChange(record, "accepted"),
      },
      {
        key: "rejected",
        label: "Reject",
        icon: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
        danger: true,
        onClick: () => handleStatusChange(record, "rejected"),
      },
    ];
  };

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      width: 60,
      render: (text, record, index) =>
        (currentPage - 1) * pageSize + index + 1,
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
      render: (_, record) =>
        record.application?.job_seeker?.full_name || "N/A",
    },
    {
      title: "Interview Date",
      dataIndex: "interview_date",
      key: "interview_date",
      render: (date) =>
        new Date(date).toLocaleString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
    },
    {
      title: "Status",
      key: "status",
      width: 150,
      render: (_, record) => getStatusTag(record),
    },
    {
      title: "Action",
      key: "action",
      width: 130,
      render: (_, record) => {
        const status = record.application?.status;
        if (status === "accepted" || status === "rejected") {
          return <span className="text-gray-400">—</span>;
        }
        const items = getActionItems(record);
        return (
          <Dropdown
            menu={{ items }}
            trigger={["click"]}
            disabled={actionLoading === record.interview_id}
          >
            <Button
              loading={actionLoading === record.interview_id}
              style={{ borderRadius: 8 }}
            >
              Action <DownOutlined />
            </Button>
          </Dropdown>
        );
      },
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
