import { useEffect, useState } from "react";
import { AdjustmentsHorizontalIcon, DocumentArrowDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Button, Dropdown, Input, Layout, Menu, Select, Table, Form } from "antd";
import Api from "../../../services/Api";
import ExportDataAppliedJob from "./ExportDataAppliedJob";
import Pagination from "../../Pagination";

const { Content } = Layout;

const HistoryApplicants = ({ studentId }) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [openExportData, setOpenExportData] = useState(false);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("applied_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const [form] = Form.useForm();

  const handleResetFilters = () => {
    form.resetFields();
    fetchData(page, true); 
  };

  const filterMenu = (
    <Menu className="p-4" style={{ width: 330, padding: "16px" }}>
      <Form  form={form} layout="vertical">
        <p className="text-[#BBBBBB] text-semibold mb-3">Filter</p>
        <Form.Item name="status" label="Status">
          <Select
            placeholder="Select Status"
            style={{ borderColor: "#BBBBBB", height: "56px", width: "298px" }}
            value={selectedStatus}
            onChange={(value) => setSelectedStatus(value)}
          >
            <Select.Option value="pending">
              <span className="text-gray-700"> Pending </span>
            </Select.Option>
            <Select.Option value="accepted">
              <span className="text-green-500"> Accepted </span>
            </Select.Option>
            <Select.Option value="rejected">
              <span className="text-red-500"> Rejected </span>
            </Select.Option>
          </Select>
        </Form.Item>

        <div className="flex justify-end space-x-2">
          <Button
            type="default"
            style={{
              width: 55,
              height: 40,
              borderColor: "#BBB",
              borderRadius: 12,
            }}
            onClick={handleResetFilters}
          >
            <span className="text-[#232323] text-xs"> Reset </span>
          </Button>
          <Button
            type="primary"
            style={{ width: 55, height: 40, borderRadius: 12 }}
            onClick={() => {
              const values = form.getFieldsValue();  // Ambil value dari form
              fetchData(page, true, { status: values.status }); // Kirim filter status ke fetchData
            }}
          >
            <span className="text-xs"> Apply </span>
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
      title: "Job Title",
      dataIndex: ["job", "title"],
      key: "title",
    },
    {
      title: "Company Name",
      dataIndex: ["company", "legal_name"],
      key: "legal_name",
    },
    {
      title: "Experience Level",
      dataIndex: ["job", "experience_requirement"],
      key: "experience_requirement",
    },
    {
      title: "Time Applying",
      dataIndex: "applied_at",
      key: "applied_at",
      render: (text) => {
        const date = new Date(text);
        const options = { day: "2-digit", month: "long", year: "numeric" };
        return date.toLocaleDateString("id-ID", options);
      },
    },
    {
      title: "Date Hired",
      dataIndex: "hired_at",
      key: "hired_at",
      render: (text) => {
        const date = new Date(text);
        const options = { day: "2-digit", month: "long", year: "numeric" };
        return date.toLocaleDateString("id-ID", options);
      },
    },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  const fetchData = (page, shouldFetchData, filters = {}) => {
    if (shouldFetchData) {
      setLoading(true);
      const filterParams = [];
      if (filters.status) {
        filterParams.push(`status=${filters.status}`);
      }

      const params = filterParams.length ? `&${filterParams.join("&")}` : "";

      Api.get(`/applied-jobs/${studentId}/?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}${params}`)
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
    fetchData(page, pageSize, sortBy, sortOrder, search,);
  }, [page, pageSize, sortBy, sortOrder, search]);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
  }, [search, sortBy, sortOrder, selectedStatus]);

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

  return (
    <Content>
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
            icon={<DocumentArrowDownIcon className="size-5" />}
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
        className="mt-3 overflow-x-auto max-w-full custom-table"
        columns={columns}
        rowKey={(record) => record.job_seeker_id}
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
      />
      {openExportData && (
        <ExportDataAppliedJob
          open={openExportData}
          setOpen={setOpenExportData}
          jobSeekerId={studentId}
        />
      )}
    </Content>
  );
};

export default HistoryApplicants;
