import { useEffect, useState } from "react";
import { AdjustmentsHorizontalIcon, ClockIcon, DocumentArrowDownIcon, EyeIcon, EllipsisVerticalIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Button, Dropdown, DatePicker, Input, Layout, Menu, Select, Table, Form } from "antd";
import Api from "../../../services/Api";
import HistoryApplicants from "./HistoryApplicants";
import Pagination from "../../Pagination";
import ExportData from "./ExportData";
import Show from "./Show";

const { Content } = Layout;
const { RangePicker } = DatePicker;

const RegisteredStudentList = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectStudentData, setSelectedStudentData] = useState(null);

  const [openExportData, setOpenExportData] = useState(false);
  const [openShow, setOpenShow] = useState(false);
  const [openHistoryApplicants, setOpenHistoryApplicants] = useState(false);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterClassYear, setFilterClassYear] = useState([]);
  const [selectedClassYear, setSelectedClassYear] = useState(null);
  const [selectedRegistrationTime, setSelectedRegistrationTime] = useState([]);

  const handleMenuClick = (record, action) => {
    if (action === "history-applicants") {
      setSelectedStudentData(record.job_seeker_id);
      setOpenHistoryApplicants(true);
    } else if (action === "show") {
      setSelectedStudentData(record.job_seeker_id);
      setOpenShow(true);
    }
  };

  const handleResetFilters = () => {
    setSelectedClassYear(null);
    setSelectedRegistrationTime([]);
    fetchData(page, true); 
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
      <Menu.Item
        key="history-applicants"
        icon={<ClockIcon className="size-5" />}
      >
        History Applicants
      </Menu.Item>
    </Menu>
  );


  const filterMenu = (
    <Menu className="p-4" style={{ width: 330, padding: "16px" }}>
      <Form layout="vertical">
        <p className="text-[#bbb] text-semibold">Filter</p>
        <Form.Item label="Class Year">
          <Select
            placeholder="Select Class Year"
            options={filterClassYear.map((start_date) => ({
              value: start_date,
              label: start_date,
            }))}
            value={selectedClassYear}
            style={{ borderColor: "#BBBBBB", height: "56px", width: "298px" }}
            onChange={(value) => setSelectedClassYear(value)}
          />
        </Form.Item>
  
        <Form.Item label="Registration Time">
          <RangePicker
            style={{ borderColor: "#BBBBBB", height: "56px", width: "298px", borderRadius: 12 }}
            value={selectedRegistrationTime}
            onChange={(dates) => setSelectedRegistrationTime(dates)}
          />
        </Form.Item>
  
        <div className="flex justify-end space-x-2">
          <Button
            type="default"
            style={{ width: 55, height: 40, borderRadius: 12, borderColor: "#BBB" }}
            onClick={handleResetFilters}
          >
            <span className="text-xs"> Reset</span>
          </Button>
          <Button
            type="primary"
            style={{ width: 55, height: 40, borderRadius: 12 }}
            onClick={() => fetchData(page, true)}
          >
            <span className="text-xs"> Apply</span>
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
    {
      title: "Student Name",
      dataIndex: ["job_seeker", "full_name"],
      key: "full_name",
    },
    {
      title: "Major",
      dataIndex: ["education", "major"],
      key: "major",
    },
    {
      title: "Class Year",
      dataIndex: ["education", "start_date"],
      key: "start_date",
      render: (text) => {
        const date = new Date(text);
        return date.getFullYear();
      },
    },
    {
      title: "Registration Time",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => {
        const date = new Date(text);
        const options = { day: "2-digit", month: "long", year: "numeric" };
        return date.toLocaleDateString("id-ID", options);
      },
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

  const fetchData = (page, shouldFetchData) => {
  if (shouldFetchData) {
    setLoading(true);
    
    const filters = [];
    if (selectedClassYear) {
      filters.push(`classYear=${selectedClassYear}`);
    }
    if (selectedRegistrationTime && selectedRegistrationTime.length === 2) {      
      const startDate = selectedRegistrationTime[0].format('YYYY-MM-DD');
      const endDate = selectedRegistrationTime[1].format('YYYY-MM-DD');
      filters.push(`startDate=${startDate}`);
      filters.push(`endDate=${endDate}`);
    }

    const filterParams = filters.length ? `&${filters.join("&")}` : "";

    Api.get(`/student/management/registered/?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}${filterParams}`)
      .then((response) => {
        const studentData = response.data;
        const uniqueClassYear = Array.from(
          new Set(
            studentData.map((item) =>
              new Date(item.education.start_date).getFullYear()
            )
          )
        );
        setData(studentData);
        setFilterClassYear(uniqueClassYear);
        setTotalData(response.totalData);
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
  }, [page, pageSize, sortBy, sortOrder, search, ]);

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
      setSortBy("created_at");
      setSortOrder("desc");
    } else if (value === "oldest") {
      setSortBy("created_at");
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
    setOpenShow(false)
  }

  return (
    <Content className="p-6 mt-3">
      {openHistoryApplicants ? (
        <HistoryApplicants
          open={openHistoryApplicants}
          setOpen={setOpenHistoryApplicants}
          studentId={selectStudentData}
        />
      ) : openShow ? (
        <Show
          open={openShow}
          setOpen={setOpenShow}
          studentId={selectStudentData}
          onBack={handleBack}
        />
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Button
                style={{
                  width: "140px",
                  height: "48px",
                  color: "gray",
                  backgroundColor: "transparent",
                  border: "none",
                  borderBottom: "2px solid #9A9A9A",
                }}
                icon={<DocumentArrowDownIcon className="size-5"/>}
                onClick={() => setOpenExportData(true)}
              >               
                <span className="font-medium text-base"> Export Data </span>
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

          <Table
            className="mt-3 overflow-x-auto max-w-full custom-table custom-table-wrapper"
            columns={columns}
            rowKey={(record) => record.id}
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
        </>
      )}
      {openExportData && (
        <ExportData open={openExportData} setOpen={setOpenExportData} />
      )}
    </Content>
  );
};

export default RegisteredStudentList;
