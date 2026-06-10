import { useEffect, useState } from "react";
import {
  EyeIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilSquareIcon,
  UsersIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Dropdown,
  Input,
  Layout,
  Menu,
  Select,
  Table,
  Segmented,
  Form,
  DatePicker,
  App,
} from "antd";
import Api from "../../services/Api";
import ExportData from "./ExportData";
import ShowApplicants from "./ShowApplicants";
import CVResume from "./CVResume";
import Approval from "./Approval";
import Pagination from "../Pagination";

const { Content } = Layout;
const { RangePicker } = DatePicker;

const ViewApplicants = ({ jobId, onBack }) => {
  const { message } = App.useApp();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalData, setTotalData] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [totalWaitingInterview, setTotalWaitingInterview] = useState(0);
  const [totalAccepted, setTotalAccepted] = useState(0);
  const [totalRejected, setTotalRejected] = useState(0);
  const [loading, setLoading] = useState(false);
  const [valueSegmented, setValueSegmented] = useState("all");
  const [selectApplicantsData, setSelectedApplicantsData] = useState(null);
  const [selectedApplicantRecord, setSelectedApplicantRecord] = useState(null);

  const [openExportData, setOpenExportData] = useState(false);
  const [openDetailView, setOpenDetailView] = useState(false);
  const [openCVResume, setOpenCVResume] = useState(false);
  const [openApproval, setOpenApproval] = useState(false);

  const [search, setSearch] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortBy, setSortBy] = useState("applied_at");
  const [sortOrder, setSortOrder] = useState("desc");

  const handleMenuClick = (record, action) => {
    if (action === "show") {
      setSelectedApplicantsData(record.application_id);
      setSelectedApplicantRecord(record);
      setOpenDetailView(true);
    } else if (action === "cv_resume") {
      setSelectedApplicantsData(record.application_id);
      setSelectedApplicantRecord(record);
      setOpenCVResume(true);
    } else if (action === "approval") {
      setSelectedApplicantsData(record.application_id);
      setSelectedApplicantRecord(record);
      setOpenApproval(true);
    }
  };

  const getMenuItems = (record) => [
    {
      key: "action-title",
      label: "ACTION",
      type: "group",
    },
    {
      key: "show",
      label: "Show",
      icon: <EyeIcon className="size-5" />,
    },
    {
      key: "cv_resume",
      label: "CV / Resume",
      icon: <PencilSquareIcon className="size-5" />,
    },
    {
      key: "approval",
      label: "Approval",
      icon: <UsersIcon className="size-5" />,
    },
  ];

  const filterMenuItems = [
    {
      key: "filter-form",
      label: (
        <div className="p-2" onClick={(e) => e.stopPropagation()}>
          <Form layout="vertical">
            <p className="text-gray-400 text-bold">Filter</p>
            <Form.Item label="Select Date">
              <RangePicker
                style={{
                  borderColor: "#BBBBBB",
                  height: "56px",
                  width: "298px",
                  borderRadius: 12,
                }}
              />
            </Form.Item>

            <Form.Item label="Salary">
              <Select
                placeholder="Select Salary"
                style={{ borderColor: "#BBBBBB", height: "56px", width: "298px" }}
              >
                <Select.Option value="informatics">
                  Informatics Engineering
                </Select.Option>
                <Select.Option value="business">
                  Business Administration
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Experience">
              <Select
                placeholder="Select Experience"
                style={{ borderColor: "#BBBBBB", height: "56px", width: "298px" }}
              >
                <Select.Option value="informatics">
                  Informatics Engineering
                </Select.Option>
                <Select.Option value="business">
                  Business Administration
                </Select.Option>
              </Select>
            </Form.Item>

            <div className="flex justify-end space-x-2">
              <Button
                style={{
                  width: 54,
                  height: 40,
                  borderColor: "#BBB",
                  borderRadius: 12,
                }}
              >
                <span className="text-xs">Reset</span>
              </Button>
              <Button
                type="primary"
                style={{ width: 54, height: 40, borderRadius: 12 }}
              >
                <span className="text-xs">Apply</span>
              </Button>
            </div>
          </Form>
        </div>
      ),
    },
  ];

  const columns = [
    {
      title: "No",
      key: "no",
      width: "5%",
      render: (text, record, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "Full Name",
      dataIndex: ["job_seeker", "full_name"],
      key: "full_name",
    },
    {
      title: "Major",
      dataIndex: ["job_seeker", "major"],
      key: "major",
    },
    {
      title: "Location",
      dataIndex: ["job_seeker", "address"],
      key: "address",
    },
    {
      title: "Experience",
      dataIndex: "experience_years",
      key: "experience",
      render: (text) => `${text} YoE`,
    },
    {
      title: "Expected Salary",
      dataIndex: "expected_salary",
      key: "expected_salary",
    },
    {
      title: "Action",
      key: "action",
      width: "10%",
      render: (text, record) => (
        <Dropdown
          menu={{
            items: getMenuItems(record),
            onClick: ({ key }) => handleMenuClick(record, key),
            className: "custom-menu",
          }}
          trigger={["click"]}
        >
          <button className="size-5 text-red-600 ml-3">
            <EllipsisVerticalIcon />
          </button>
        </Dropdown>
      ),
    },
  ];

  const fetchData = (page, shouldFetchData) => {
    if (shouldFetchData) {
      setLoading(true);
      const url = `/jobs/applicants/${jobId}?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}&status=${valueSegmented}`;
      Api.get(url)
        .then((response) => {
          setData(response.data);
          setTotalData(response.totalData);
          setTotalPending(response.totalPending);
          setTotalWaitingInterview(response.totalWaitingInterview);
          setTotalAccepted(response.totalAccepted);
          setTotalRejected(response.totalRejected);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchData(page, pageSize, sortBy, sortOrder, search);
  }, [page, pageSize, sortBy, sortOrder, search, valueSegmented]);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
  }, [search, sortBy, sortOrder]);

  const handleSortChange = (value) => {
    if (value === "newest") {
      setSortBy("applied_at");
      setSortOrder("desc");
    } else if (value === "oldest") {
      setSortBy("applied_at");
      setSortOrder("asc");
    }
  };

  const handleSearch = (value) => {
    setSearch(value.toLowerCase());
  };

  const handlePageChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleFilterClick = () => {
    setFilterVisible(!filterVisible);
  };

  const handleBack = () => {
    setOpenDetailView(false);
  };

  const handleApplicantStatusUpdated = (applicationId, nextStatus) => {
    const normalizedStatus = (nextStatus || "").replace(/\s+/g, "_");

    setData((prev) =>
      prev.map((item) =>
        item.application_id === applicationId
          ? { ...item, status: normalizedStatus }
          : item
      )
    );

    setSelectedApplicantRecord((prev) =>
      prev && prev.application_id === applicationId
        ? { ...prev, status: normalizedStatus }
        : prev
    );
  };

  return (
    <Content>
      {openDetailView ? (
        <ShowApplicants
          open={openDetailView}
          setOpen={setOpenDetailView}
          onBack={handleBack}
          applicantsId={selectApplicantsData}
        />
      ) : (
        <>
          <div className="flex items-center justify-end mb-6">
            <Button
              type="primary"
              style={{ height: 48 }}
              className="rounded-2xl focus:outline-none focus:shadow-outline items-center justify-center py-4 md:h-10 md:py-2 md:px-4 flex items-center"
              onClick={() => setOpenExportData(true)}
            >
              <PlusIcon className="size-5" />
              Export Data
            </Button>
          </div>
          <div className="border-b border-[#bbb] mb-6" />
          <div className="flex justify-between mb-6">
            <Segmented
              options={[
                { label: `All ${totalData}`, value: "all" },
                { label: `Pending ${totalPending}`, value: "pending" },
                { label: `Waiting Interview ${totalWaitingInterview}`, value: "waiting_interview" },
                { label: `Accepted ${totalAccepted}`, value: "accepted" },
                { label: `Rejected ${totalRejected}`, value: "rejected" },
              ]}
              onChange={setValueSegmented}
              className="custom-segmented"
              value={valueSegmented}
            />

            <div className="flex items-center space-x-2">
              <Select
                defaultValue="newest"
                className="custom-select"
                style={{ width: 120, height: 48 }}
                onChange={handleSortChange}
                options={[
                  {
                    label: <span className="font-bold ml-3">SORT</span>,
                    options: [
                      {
                        label: "Newest",
                        value: "newest",
                      },
                      {
                        label: "Oldest",
                        value: "oldest",
                      },
                    ],
                  },
                ]}
              />

              <Dropdown
                menu={{ items: filterMenuItems }}
                open={filterVisible}
                onOpenChange={setFilterVisible}
                trigger={["click"]}
              >
                <Button
                  onClick={handleFilterClick}
                  style={{
                    width: 52,
                    height: 48,
                    borderRadius: "12px",
                    backgroundColor: filterVisible ? "#dc232e" : "white",
                    color: filterVisible ? "white" : "black",
                  }}
                >
                  <AdjustmentsHorizontalIcon
                    style={{ color: filterVisible ? "white" : "#dc232e" }}
                  />
                </Button>
              </Dropdown>
              <div className="relative w-64">
                <Input
                  placeholder="Search"
                  className="pl-10 pr-3 py-2"
                  style={{ width: 250, height: 48, borderRadius: "12px" }}
                  onSearch={(value) => setSearch(value)}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <MagnifyingGlassIcon className="absolute left-3 top-3 size-5 text-red-600" />
              </div>
            </div>
          </div>
          <Table
            className="mt-3 overflow-x-auto max-w-full custom-table"
            columns={columns}
            rowKey={(record) => record.job_id}
            dataSource={data}
            loading={loading}
            pagination={false}
            footer={() => (
              <Pagination
                current={page}
                pageSize={pageSize}
                total={totalData}
                onPageChange={(newPage, newPageSize) =>
                  handlePageChange(newPage, newPageSize)
                }
                onPageSizeChange={(current, newSize) => {
                  setPageSize(newSize);
                  setPage(1);
                }}
              />
            )}
          />
          <div className="flex justify-end mt-6">
            <Button
              size="large"
              onClick={onBack}
            >
              <span className="text-sm font-medium"> Back </span>
            </Button>
          </div>
        </>
      )}
      {openExportData && (
        <ExportData
          open={openExportData}
          setOpen={setOpenExportData}
          onBack={handleBack}
          jobId={jobId}
        />
      )}
      {openCVResume && (
        <CVResume
          open={openCVResume}
          setOpen={setOpenCVResume}
          applicantsId={selectApplicantsData}
        />
      )}
      {openApproval && (
        <Approval
          open={openApproval}
          setOpen={setOpenApproval}
          applicantsData={selectedApplicantRecord}
          fetchData={fetchData}
          onStatusUpdated={handleApplicantStatusUpdated}
        />
      )}
    </Content>
  );
};

export default ViewApplicants;
