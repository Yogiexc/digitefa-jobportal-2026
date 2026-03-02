import { useState, useEffect } from "react";
import { Input, Layout, Table, Select, Dropdown, Menu } from "antd";
import { BriefcaseIcon, CheckBadgeIcon, EllipsisVerticalIcon, EyeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Api from "../../services/Api";
import Show from "./Show";
import Status from "./Status";
import JobVacancy from "./JobVacancy";
import Pagination from "../Pagination";

const { Content } = Layout;

const CompanyList = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const [openDetailView, setOpenDetailView] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [openJobVacancy, setOpenJobVacancy] = useState(false);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  const handleMenuClick = (record, action) => {
    if (action === "show") {
      setSelectedCompany(record.company_id);
      setOpenDetailView(true);
    } else if (action === "status") {
      setSelectedCompany(record);
      setOpenStatus(true);
    } else if (action === "job_vacancy") {
      setSelectedCompany(record.company_id);
      setOpenJobVacancy(true);
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
      <Menu.Item key="status" icon={<CheckBadgeIcon className="size-5" />}>
        Status
      </Menu.Item>
      <Menu.Item key="job_vacancy" icon={<BriefcaseIcon className="size-5" />}>
        Job Vacancy
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "No",
      key: "no",
      width: "5%",
      render: (text, record, index) => (page - 1) * pageSize + index + 1,
    },
    { title: "Company Name", dataIndex: "legal_name", key: "legal_name", width: "25%", },
    { title: "Email", dataIndex: "email", key: "email", width: "30%", },
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "";
        switch (status) {
          case "Accepted":
            color = "green";
            break;
          case "Rejected":
            color = "red";
            break;
          case "Pending":
            color = "blue";
            break;
          default:
            color = "black";
        }
        return <span style={{ color }}>{status}</span>;
      },
    },
    {
      title: "Action",
      key: "action",
      width: "10%",
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
      const url = `/companies/management?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}`;
      Api.get(url)
        .then((response) => {
          setData(response.data);
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
      setSortBy("created_at");
      setSortOrder("desc");
    } else if (value === "oldest") {
      setSortBy("created_at");
      setSortOrder("asc");
    }
  };

  const handlePageChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleBack = () => {
    setOpenDetailView(false);
    setOpenJobVacancy(false);
  };

  return (
    <Content className="p-6 -mt-3">
      {openDetailView ? (
        <Show
          open={openDetailView}
          setOpen={setOpenDetailView}
          onBack={handleBack}
          companyId={selectedCompany}
        />
      ) : openJobVacancy ? (
        <JobVacancy
          open={openJobVacancy}
          setOpen={setOpenJobVacancy}
          onBack={handleBack}
          companyId={selectedCompany}
        />
      ) : (
        <>
          <br />
          <div className="flex items-center justify-between w-full h-auto mb-6">
            <div className="flex items-center space-x-2">
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
            </div>
          </div>

          <Table
            className="mt-3 overflow-x-auto max-w-full custom-table custom-table-wrapper"
            columns={columns}
            rowKey={(record) => record.company_id}
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
      <Status
        open={openStatus}
        setOpen={setOpenStatus}
        companyData={selectedCompany}
        fetchData={fetchData}
        setPage={setPage}
      />
    </Content>
  );
};

export default CompanyList;
