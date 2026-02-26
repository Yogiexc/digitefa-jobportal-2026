import { useEffect, useState } from "react";
import {
  ArrowPathIcon,
  EyeIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilSquareIcon,
  UsersIcon,
  TrashIcon,
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
} from "antd";
import Api from "../../services/Api";
import AddData from "./AddData";
import Show from "./Show";
import EditData from "./EditData";
import Reupload from "./Reupload";
import ViewApplicants from "./ViewApplicants";
import Delete from "./Delete";
import Pagination from "../Pagination";
import StatusModal from "../StatusModal";

const { Content } = Layout;

const JobVacancyList = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalData, setTotalData] = useState(0);
  const [totalActive, setTotalActive] = useState(0);
  const [totalExpired, setTotalExpired] = useState(0);
  const [totalDraft, setTotalDraft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [valueSegmented, setValueSegmented] = useState("all");
  const [selectJobData, setSelectedJobData] = useState(null);

  const [openDetailView, setOpenDetailView] = useState(false);
  const [openAddData, setOpenAddData] = useState(false);
  const [openEditData, setOpenEditData] = useState(false);
  const [openReuploadData, setOpenReuploadData] = useState(false);
  const [openViewApplicants, setOpenViewApplicants] = useState(false);
  const [openDeleteData, setOpenDeleteData] = useState(false);

  const [modalMessage, setModalMessage] = useState("");
  const [modalStatus, setModalStatus] = useState("");
  const [openStatusModal, setOpenStatusModal] = useState(false);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("updated_at");
  const [sortOrder, setSortOrder] = useState("desc");

  const handleMenuClick = (record, action) => {
    if (action === "show") {
      setSelectedJobData(record.job_id);
      setOpenDetailView(true);
    } else if (action === "edit") {
      setSelectedJobData(record.job_id);
      setOpenEditData(true);
    } else if (action === "reupload") {
      setSelectedJobData(record.job_id);
      setOpenReuploadData(true);
    } else if (action === "view_applicants") {
      setSelectedJobData(record.job_id);
      setOpenViewApplicants(true);
    } else if (action === "delete") {
      setSelectedJobData(record.job_id);
      setOpenDeleteData(true);
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
      <Menu.Item key="edit" icon={<PencilSquareIcon className="size-5" />}>
        Edit
      </Menu.Item>
      <Menu.Item key="view_applicants" icon={<UsersIcon className="size-5" />}>
        <div className="relative">
          View <br />
          Applicants
          <badge className="bg-[#B6EBCF] text-[#0C6937] max-w-[70px] h-10 rounded-xl text-[10px] absolute top-0 right-0 flex items-center">
            {record.total_applicants}
            <span className="ml-1">New</span>
          </badge>
        </div>
      </Menu.Item>
      <Menu.Item key="reupload" icon={<ArrowPathIcon className="size-5" />}>
        Reupload
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
        const isExpired = date < new Date();
        return (
          <span style={{ color: isExpired ? "red" : "inherit" }}>
            {date.toLocaleDateString("id-ID", options)}
          </span>
        );
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
      const url = `/jobs?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}&status=${valueSegmented}`;
      Api.get(url)
        .then((response) => {
          setData(response.data);
          setTotalData(response.totalData);
          setTotalActive(response.totalActive);
          setTotalExpired(response.totalExpired);
          setTotalDraft(response.totalDraft);
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
  }, [
    page,
    pageSize,
    sortBy,
    sortOrder,
    search,
    openAddData,
    openEditData,
    valueSegmented,
    openDeleteData,
    openReuploadData,
  ]);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
  }, [search, sortBy, sortOrder]);

  const handleSortChange = (value) => {
    if (value === "newest") {
      setSortBy("updated_at");
      setSortOrder("desc");
    } else if (value === "oldest") {
      setSortBy("updated_at");
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

  const handleBack = () => {
    setOpenDetailView(false);
    setOpenEditData(false);
    setOpenReuploadData(false);
  };

  return (
    <Content className="p-6">
      {openAddData ? (
        <AddData
          open={openAddData}
          setOpen={setOpenAddData}
          onBack={() => setOpenAddData(false)}
          setOpenStatusModal={setOpenStatusModal}
          setModalMessage={setModalMessage}
          setModalStatus={setModalStatus}
        />
      ) : openDetailView ? (
        <Show
          open={openDetailView}
          setOpen={setOpenDetailView}
          onBack={handleBack}
          jobId={selectJobData}
        />
      ) : openEditData ? (
        <EditData
          open={openEditData}
          setOpen={setOpenEditData}
          onBack={handleBack}
          jobId={selectJobData}
          setOpenStatusModal={setOpenStatusModal}
          setModalMessage={setModalMessage}
          setModalStatus={setModalStatus}
        />
      ) : openReuploadData ? (
        <Reupload
          open={openReuploadData}
          setOpen={setOpenReuploadData}
          onBack={handleBack}
          jobId={selectJobData}
          setOpenStatusModal={setOpenStatusModal}
          setModalMessage={setModalMessage}
          setModalStatus={setModalStatus}
        />
      ) : openViewApplicants ? (
        <ViewApplicants
          open={openViewApplicants}
          setOpen={setOpenViewApplicants}
          onBack={handleBack}
          jobId={selectJobData}
        />
      ) : (
        <>
          <div className="flex justify-end mb-6">
            <Button
              type="primary"
              style={{ height: 48 }}
              className="rounded-2xl focus:outline-none focus:shadow-outline  md:px-4 flex items-center"
              onClick={() => setOpenAddData(true)}
            >
              <PlusIcon className="size-5" />
              Add Data
            </Button>
          </div>
          <hr className="border-b border-[#bbb] mb-6" />
          <div className="flex justify-between mb-6">
            <Segmented
              options={[
                { label: `All ${totalData}`, value: "all" },
                { label: `Active ${totalActive}`, value: "active" },
                { label: `Expired ${totalExpired}`, value: "expired" },
                { label: `Draft ${totalDraft}`, value: "draft" },
              ]}
              onChange={setValueSegmented}
              className="custom-segmented"
              value={valueSegmented}
            />

            <div className="flex space-x-2">
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
      <Delete
        open={openDeleteData}
        setOpen={setOpenDeleteData}
        jobId={selectJobData}
        fetchData={fetchData}
      />
      <StatusModal
        open={openStatusModal}
        setOpen={setOpenStatusModal}
        message={modalMessage}
        status={modalStatus}
      />
    </Content>
  );
};

export default JobVacancyList;
