import { useEffect, useState } from "react";
import {
  AdjustmentsHorizontalIcon,
  EyeIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  Dropdown,
  Input,
  Layout,
  Menu,
  Select,
  Table,
  Form,
  Badge,
} from "antd";
import Api from "../../../services/Api";
import Pagination from "../../Pagination";
import Show from "./Show";
import ExportData from "../student-employment-history/ExportData";

const { Content } = Layout;
const StudentEmploymentHistoryList = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalData, setTotalData] = useState(0);
  const [selectStudentData, setSelectedStudentData] = useState(null);

  const [openShow, setOpenShow] = useState(false);
  const [openExportData, setOpenExportData] = useState(false);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("applied_at");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterClassYear, setFilterClassYear] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false);

  const [form] = Form.useForm();

  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedClassYear, setSelectedClassYear] = useState(null);
  const [selectedEmploymentType, setSelectedEmploymentType] = useState(null);
  const [secureLogData, setSecureLogData] = useState();

  const fetchSecuredLog = () => {
    Api.get("/settings/secure-log")
      .then((response) => {
        setSecureLogData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchSecuredLog();
  }, []);

  useEffect(() => {
    let intervalId;

    if (secureLogData?.secureLogEnabled === "true") {
      fetchData(page, true);

      intervalId = setInterval(() => {
        fetchData(page, true);
      }, secureLogData?.secureLogInterval * 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [secureLogData, secureLogData?.secureLogEnabled]);

  const handleResetFilters = () => {
    form.resetFields();
    fetchData(page, true);
  };

  const handleMenuClick = (record, action) => {
    if (action === "show") {
      setSelectedStudentData(record.job_seeker.job_seeker_id);
      setOpenShow(true);
    }
  };

  const menu = (record) => (
    <Menu
      onClick={({ key }) => handleMenuClick(record, key)}
      className="custom-menu"
    >
      <Menu.ItemGroup title="ACTION" className="custom-menu-item-group" />
      <Menu.Item key="show" icon={<EyeIcon className="size-5" />}>
        Show
      </Menu.Item>
    </Menu>
  );

  const filterMenu = (
    <Menu className="p-4" style={{ width: 330, padding: "16px" }}>
      <Form form={form} layout="vertical">
        <p className="text-gray-400 text-bold">Filter</p>
        <Form.Item label="Class Year" name="class_year">
          <Select
            placeholder="Select Class Year"
            options={filterClassYear.map((class_year) => ({
              value: class_year,
              label: class_year,
            }))}
            value={selectedClassYear}
            style={{ borderColor: "#BBBBBB", height: "56px", width: "298px" }}
            onChange={(value) => setSelectedClassYear(value)}
          />
        </Form.Item>

        <Form.Item label="Employment Type" name="employment_type">
          <Select
            placeholder="Select Employment Type"
            style={{ borderColor: "#BBBBBB", height: "48px", width: "298px" }}
            value={selectedEmploymentType}
            onChange={(value) => setSelectedEmploymentType(value)}
          >
            <Select.Option value="full_time">Full Time</Select.Option>
            <Select.Option value="part_time">Part Time</Select.Option>
            <Select.Option value="freelance">Freelance</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Status" name="status">
          <Select
            placeholder="Select Status"
            style={{ borderColor: "#BBBBBB", height: "48px", width: "298px" }}
            value={selectedStatus}
            onChange={(value) => setSelectedStatus(value)}
          >
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="accepted">Accepted</Select.Option>
            <Select.Option value="waiting_interview">Waiting Interview</Select.Option>
            <Select.Option value="rejected">Rejected</Select.Option>
          </Select>
        </Form.Item>

        <div className="flex justify-end space-x-2">
          <Button
            className="rounded-xl flex items-center justify-center w-18 h-10"
            onClick={handleResetFilters}
          >
            Reset
          </Button>
          <Button
            type="primary"
            className="rounded-xl flex items-center justify-center w-18 h-10"
            onClick={() => {
              const values = form.getFieldsValue(); // Ambil value dari form
              fetchData(page, true, {
                status: values.status,
                employment_type: values.employment_type,
                class_year: values.class_year,
              }); // Kirim filter status ke fetchData
            }}
          >
            Apply
          </Button>
        </div>
      </Form>
    </Menu>
  );

  const columns = [
    {
      title: "No",
      key: "no",
      width: "5%",
      render: (text, record, index) => (page - 1) * pageSize + index + 1,
    },
    ...(secureLogData?.secureLogEnabled === "true"
      ? [
        {
          title: "Student UUID",
          dataIndex: ["job_seeker", "job_seeker_id"],
          key: "job_seeker_id",
          width: "20%",
        },
      ]
      : []),
    {
      title: "Student Name",
      dataIndex: ["job_seeker", "full_name"],
      key: "full_name",
      width: "15%",
    },
    {
      title: "Class Year",
      dataIndex: ["job_seeker", "class_year"],
      key: "class_year",
      width: "8%",
      render: (text) => {
        const date = new Date(text);
        return date.getFullYear();
      },
    },
    {
      title: "Company Name",
      dataIndex: ["company", "legal_name"],
      key: "legal_name",
    },
    {
      title: "Job Tittle",
      dataIndex: ["job", "title"],
      key: "title",
    },
    {
      title: "Employment Type",
      dataIndex: ["job", "employment_type"],
      key: "employment_type",
    },
    {
      title: "Apply Date",
      dataIndex: "applied_at",
      key: "applied_at",
      render: (text) => {
        const date = new Date(text);
        const options = { day: "2-digit", month: "long", year: "numeric" };
        return date.toLocaleDateString("id-ID", options);
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        if (!text) return text;
        const normalizedText = text.toLowerCase();
        if (normalizedText === "waiting_interview" || normalizedText === "waiting interview") {
          return "Waiting Interview";
        }
        return text.charAt(0).toUpperCase() + text.slice(1);
      },
    },
    {
      title: "Application Outcome Dates",
      dataIndex: "application_outcome_dates",
      key: "application_outcome_dates",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Dropdown overlay={menu(record)} trigger={["click"]}>
          <button className="size-5 text-red-600 ml-3">
            <EllipsisVerticalIcon />
          </button>
        </Dropdown>
      ),
    },
  ];

  const fetchData = (page, shouldFetchData, filters = {}) => {
    if (shouldFetchData) {
      const filterParams = [];
      if (filters.status) {
        filterParams.push(`status=${filters.status}`);
      }
      if (filters.class_year) {
        filterParams.push(`classYear=${filters.class_year}`);
      }
      if (filters.employment_type) {
        filterParams.push(`employmentType=${filters.employment_type}`);
      }

      const params = filterParams.length ? `&${filterParams.join("&")}` : "";

      const url = `/student/management/history?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}${params}`;
      Api.get(url)
        .then((response) => {
          const studentData = response.data;
          const uniqueClassYear = Array.from(
            new Set(
              studentData.map((item) =>
                new Date(item.job_seeker.class_year).getFullYear()
              )
            )
          );

          setData(response.data);
          setFilterClassYear(uniqueClassYear);
          setTotalData(response.totalData);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  };

  useEffect(() => {
    fetchData(page, pageSize, sortBy, sortOrder, search);
  }, [page, pageSize, sortBy, sortOrder, search]);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
  }, [search, sortBy, sortOrder]);

  const handleSearch = (value) => {
    setSearch(value.toLowerCase());
  };

  const handleSortChange = (value) => {
    if (value === "newest") {
      setSortBy("applied_at");
      setSortOrder("desc");
    } else if (value === "oldest") {
      setSortBy("applied_at");
      setSortOrder("asc");
    }
  };

  const handleFilterClick = () => {
    setFilterVisible(!filterVisible);
  };

  const handlePageChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleBack = () => {
    setOpenShow(false);
  };

  return (
    <Content className="p-6 mt-3">
      {openShow ? (
        <Show
          open={openShow}
          setOpen={setOpenShow}
          studentId={selectStudentData}
          onBack={handleBack}
        />
      ) : (
        <>
          <div className="flex flex-col mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 mb-4">
                <Button
                  style={{
                    width: "140px",
                    height: "48px",
                    color: "gray",
                    backgroundColor: "transparent",
                    border: "none",
                    borderBottom: "2px solid #9A9A9A",
                  }}
                  icon={<DocumentArrowDownIcon className="size-5" />}
                  onClick={() => setOpenExportData(true)}
                >
                  <span className="font-medium text-base"> Export Data</span>
                </Button>
              </div>

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
                  overlay={filterMenu}
                  visible={filterVisible}
                  onVisibleChange={setFilterVisible}
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
            <div className="flex justify-end mr-4">
              {secureLogData?.secureLogEnabled === "true" && (
                <Badge
                  className="pulse-badge"
                  color="green"
                  text="Blockchain Secured"
                />
              )}
            </div>
          </div>

          <Table
            className="mt-3 overflow-x-auto max-w-full custom-table custom-scrollbar custom-table-wrapper"
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={data}
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
            scroll={{ x: "max-content" }}
          />
        </>
      )}

      {openExportData && (
        <ExportData open={openExportData} setOpen={setOpenExportData} />
      )}
    </Content>
  );
};

export default StudentEmploymentHistoryList;
