import { useEffect, useState } from "react";
import { Input, Layout, Table, Select } from "antd";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Api from "../../../services/Api";
import Pagination from "../../Pagination";

const { Content } = Layout;

const JobSeekerList = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("updated_at");
  const [sortOrder, setSortOrder] = useState("desc");

  const columns = [
    {
      title: "No",
      key: "no",
      width: "5%",
      render: (text, record, index) => (page - 1) * pageSize + index + 1,
    },
    { title: "Full Name", dataIndex: "full_name", key: "full_name", width: "30%" },
    { title: "Email", dataIndex: "email", key: "email", width: "30%" },
    {
      title: "Registration Time",
      dataIndex: "created_at",
      key: "created_at",
      width: "18%",
      render: (text) => {
        const date = new Date(text);
        const options = { day: "2-digit", month: "long", year: "numeric" };
        return date.toLocaleDateString("id-ID", options);
      },
    },
  ];


  const fetchData = (page, shouldFetchData) => {
    if (shouldFetchData) {
      setLoading(true);
      const url = `/job-seekers/?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}`;
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

  return (
    <Content className="p-6 -mt-3">
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
        rowKey={(record) => record.job_seeker_id}
        dataSource={data}
        loading={loading}
        pagination={false}
        footer={() => (
          <Pagination
            current={page}
            pageSize={pageSize}
            total={totalData}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageChange}
          />
        )}
      />
    </Content>
  );
};

export default JobSeekerList;
