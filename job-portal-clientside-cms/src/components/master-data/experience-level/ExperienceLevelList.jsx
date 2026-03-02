import { useState, useEffect } from "react";
import { Button, Input, Layout, Table, Select, Dropdown, Menu } from "antd";
import { EllipsisVerticalIcon, PlusIcon, PencilSquareIcon, MagnifyingGlassIcon, TrashIcon,} from "@heroicons/react/24/outline";
import Api from "../../../services/Api";
import AddData from "./AddData";
import EditData from "./EditData";
import DeleteData from "./DeleteData";
import Pagination from "../../Pagination";

const { Content } = Layout;

const ExperienceLevelList = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState(null);
  
  const [openAddData, setOpenAddData] = useState(false);
  const [openEditData, setOpenEditData] = useState(false);
  const [openDeleteData, setOpenDeleteData] = useState(false);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("updated_at");
  const [sortOrder, setSortOrder] = useState("desc");

  const handleMenuClick = (record, action) => {
    if (action === "edit") {
      setSelectedExperienceLevel(record);
      setOpenEditData(true);
    } else if (action === "delete") {
      setSelectedExperienceLevel(record);
      setOpenDeleteData(true);
    }
  };

  const menu = (record) => (
    <Menu
      onClick={({ key }) => handleMenuClick(record, key)}
      className="custom-menu"
    >
      <Menu.ItemGroup title="ACTION" className="custom-menu-item-group" />
      <Menu.Item key="edit" icon={<PencilSquareIcon className="size-5" />}>
        Edit
      </Menu.Item>
      <Menu.Item key="delete" icon={<TrashIcon className="size-5" />}>
        Delete
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
    {
      title: "Experience Year",
      dataIndex: "name",
      key: "name",
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

  const fetchData = (page, shouldFetchData, sortBy, sortOrder, search) => {
    if (shouldFetchData) {
      setLoading(true);
      const url = `/experience-levels?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}`;
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
  }, [ page, pageSize, sortBy, sortOrder, search, openAddData, openEditData, openDeleteData]);

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
      setSortBy("updated_at");
      setSortOrder("desc");
    } else if (value === "oldest") {
      setSortBy("updated_at");
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
                  { label: "Newest", value: "newest" },
                  { label: "Oldest", value: "oldest" },
                ],
              },
            ]}
          />
        </div>
        <Button
          type="primary"
          style={{ height: 48 }}
          className="rounded-2xl focus:outline-none focus:shadow-outline items-center justify-center py-4 md:h-10 md:py-2 md:px-4 flex items-center"
          onClick={() => setOpenAddData(true)}
        >
          <PlusIcon className="size-5" />
          Add Data
        </Button>
      </div>

      <Table
        className="mt-3 overflow-x-auto max-w-full custom-table  custom-table-wrapper"
        columns={columns}
        rowKey={(record) => record.experience_level_id}
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

      <AddData
        open={openAddData}
        setOpen={setOpenAddData}
        fetchData={fetchData}
      />
      <EditData
        open={openEditData}
        setOpen={setOpenEditData}
        experienceLevelId={selectedExperienceLevel}
        fetchData={fetchData}
        setPage={setPage}
      />
      <DeleteData
        open={openDeleteData}
        setOpen={setOpenDeleteData}
        experienceLevelId={selectedExperienceLevel}
        fetchData={fetchData}
      />
    </Content>
  );
};

export default ExperienceLevelList;
