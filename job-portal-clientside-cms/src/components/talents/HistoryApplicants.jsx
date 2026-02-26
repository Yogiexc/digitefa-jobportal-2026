import { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Input,
  Layout,
  Select,
  Table,
} from "antd";
import Api from "../../services/Api";
import Pagination from "../Pagination";

const { Content } = Layout;

const HistoryApplicants = ({ jobSeekerId }) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("applied_at");
  const [sortOrder, setSortOrder] = useState("desc");

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
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  const fetchData = (page, shouldFetchData) => {
    if (shouldFetchData) {
      setLoading(true);
      const url = `/applied-jobs/${jobSeekerId}/?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}`;
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
      setSortBy("applied_at");
      setSortOrder("desc");
    } else if (value === "oldest") {
      setSortBy("applied_at");
      setSortOrder("asc");
    }
  };

 
  const handlePageChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  return (
    <Content>
    <br />
      <div className="flex space-x-2 mb-6">
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

      <Table
        className="mt-3 overflow-x-auto max-w-full custom-table custom-table-wrapper"
        columns={columns}
        rowKey={(record) => record.job_seeker_id}
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
    </Content>
  );
};

export default HistoryApplicants;
