import { useEffect, useState } from "react";
import { Input, Layout, Table, Select, Dropdown, Menu } from "antd";
import { EyeIcon, EllipsisVerticalIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Api from "../../services/Api";
import ShowJobVacancy from "./ShowJobVacancy";
import Pagination from "../Pagination";

const { Content } = Layout;

const JobVacancy = ({ companyId }) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedJobVacancy, setSelectedJobVacancy] = useState(null);

  const [openShowJobVacancy, setOpenShowJobVacancy] = useState(false);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  const handleMenuClick = (record, action) => {
    if (action === "show") {
      setSelectedJobVacancy(record.job_id);
      setOpenShowJobVacancy(true);
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

  const columns = [
    {
      title: "No",
      key: "no",
      width: "5%",
      render: (text, record, index) => (page - 1) * pageSize + index + 1,
    },
    { title: "Job Title", dataIndex: "title", key: "title" },
    {
      title: "Total Applicants",
      dataIndex: "total_applicants",
      key: "total_applicants",
    },
    {
      title: "Published Date",
      dataIndex: "published_at",
      key: "published_at",
      render: (text) => {
        const date = new Date(text);
        const options = { day: "2-digit", month: "long", year: "numeric" };
        return date.toLocaleDateString("id-ID", options);
      },
    },
    {
      title: "Expired Date",
      dataIndex: "expired_at",
      key: "expired_at",
      render: (text) => {
        const date = new Date(text);
        const options = { day: "2-digit", month: "long", year: "numeric" };
        return date.toLocaleDateString("id-ID", options);
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

  const fetchData = () => {
    setLoading(true);
    const url = `/jobs/company/${companyId}?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}`;
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
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, sortBy, sortOrder, search, companyId]);

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
      setSortOrder("asc");
    } else if (value === "oldest") {
      setSortBy("created_at");
      setSortOrder("desc");
    }
  };

  const handlePageChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleBack = () => {
    setOpenShowJobVacancy(false);
  };

  return (
    <Content>
      {openShowJobVacancy ? (
        <ShowJobVacancy
    
          setOpen={setOpenShowJobVacancy}
          onBack={handleBack}
          jobId={selectedJobVacancy}
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
        </>
      )}
    </Content>
  );
};

export default JobVacancy;
