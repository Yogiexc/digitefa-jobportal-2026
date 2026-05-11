import {
  Avatar,
  Breadcrumb,
  Button,
  Divider,
  Drawer,
  Dropdown,
  Layout,
  Menu,
  Typography,
} from "antd";
import {
  Bars4Icon,
  ChevronDownIcon,
  Cog6ToothIcon,
  LockClosedIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { UserOutlined } from "@ant-design/icons";
import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import useMenuSidebar from "../../hooks/useMenuSidebar";
import Footer from "../dashboard-layout/Footer";
import EditProfile from "./profile/EditProfile";
import ChangePassword from "./profile/ChangePassword";
import Logo from "../../assets/svg/DIGITEFA.svg";
import Api from "../../services/Api";

const { Header, Sider } = Layout;
const { Text } = Typography;

const DashboardLayout = ({ children }) => {
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const [profilePicture, setProfilePicture] = useState();
  const { activeMenuSidebar, menuSidebar } = useMenuSidebar();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { breadcrumbItems } = useBreadcrumbs();
  const [collapsed, setCollapsed] = useState(false);
  const navigateTo = useNavigate();
  const API_URL = import.meta.env.VITE_IMAGE_API;

  const fetchProfilePicture = async () => {
    //setLoading(true);
    await Api.get(`/profile/profile-picture`)
      .then((response) => {
        setProfilePicture(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        // setLoading(false);
      });
  };

  useEffect(() => {
    fetchProfilePicture();
  }, []);

  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);

  const showDrawer = () => {
    setDrawerVisible(true);
  }
  
  const closeDrawer = () => {
    setDrawerVisible(false);
  }


  const toggleCollapsed = useCallback(() => {
    setCollapsed((prevCollapsed) => !prevCollapsed);
  }, []);

  const onLogout = useCallback(() => {
    sessionStorage.removeItem("userData");
    sessionStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    navigateTo("/login");
  }, [navigateTo]);

  const handleEditProfile = () => {
    setOpenEditProfile(true);
  };

  const handleChangePassword = useCallback(() => {
    setOpenChangePassword(true);
  }, []);

  function AppMenu({ isInline = false}) {
    return(
      <Menu
      mode={isInline ? "inline" : "vertical"}
      defaultSelectedKeys={[activeMenuSidebar?.key]}
      defaultOpenKeys={[breadcrumbItems?.[1].key]}
      selectedKeys={[activeMenuSidebar?.key]}
      items={menuSidebar.filter((item) =>
        item.role.includes(userData?.role))}
      >
      </Menu>
    )
  }

  const menuNavbarItems = [
    {
      key: "user-info",
      label: (
        <div className="flex items-center p-2">
          <Avatar
            src={profilePicture ? `${API_URL}/${profilePicture}` : null}
            icon={<UserOutlined />}
            size={48}
          />
          <div className="ml-3">
            <div className="font-bold">{userData?.name}</div>
            <div className="text-gray-500 text-xs">{userData?.email}</div>
          </div>
        </div>
      ),
      disabled: true,
    },
    { type: "divider" },
    {
      key: "edit-profile",
      label: (
        <div className="flex items-center">
          <PencilSquareIcon className="size-5 mr-2" /> Edit Profile
        </div>
      ),
      onClick: handleEditProfile,
    },
    {
      key: "change-password",
      label: (
        <div className="flex items-center">
          <LockClosedIcon className="size-5 mr-2" /> Change Password
        </div>
      ),
      onClick: handleChangePassword,
    },
    {
      key: "setting",
      label: (
        <div className="flex items-center">
          <Cog6ToothIcon className="size-5 mr-2" /> Setting
        </div>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }} className="flex">
        <Drawer
        open={drawerVisible}
        onClose={closeDrawer}
        placement="left"
        closable
        title={
          <div className="flex justify-end">
            <Button
              className="flex items-center mr-4 bg-gray-100 hover:bg-gray-400 p-6 rounded-xl focus:outline-none focus:shadow-outline"
              shape="round"
            >
              <Dropdown menu={{ items: menuNavbarItems }} trigger={["click"]}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center mr-1">
                    <Avatar
                      src={profilePicture ? `${API_URL}/${profilePicture}` : null}
                      size={32}
                      className="mr-2"
                    />
                  </div>
                  <div className="flex flex-col items-start mr-2">
                    <Text style={{ fontSize: "14px" }}>{userData?.name}</Text>
                    <Text style={{ fontSize: "12px" }}>{userData?.role}</Text>
                  </div>
                  <ChevronDownIcon />
                </div>
              </Dropdown>
            </Button>
          </div>
        }
      >
        <AppMenu isInline />
      </Drawer>
      <Sider
        className="hidden md:inline-block custom-scrollbar"
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        theme="light"
        width={275}
        style={{
          borderRight: "1px solid #E9E9E9",
          height: "100%",
          overflow: "auto",
          position: "sticky",
          top: 0,
        }}
      >
        <div className="top-0 sticky h-screen">
          <div className="flex justify-center py-7 ">
            <img src={Logo} alt="Logo" className="w-48" />
          </div>
          <div
            className="menu-title"
            style={{
              padding: "0 32px",
              marginBottom: "8px",
            }}
          >
            <h5 className="text-xs font-medium text-[#BBB]">MAIN MENU</h5>
          </div>
          <Menu
            mode="inline"
            defaultOpenKeys={[breadcrumbItems?.[1].key]}
            defaultSelectedKeys={[activeMenuSidebar?.key]}
            selectedKeys={[activeMenuSidebar?.key]}
            items={
              menuSidebar
                .filter((item) => item.role.includes(userData?.role))
                .map((item) => {
                  if (item.key === "log-out") {
                    return [
                      { type: "divider" }, 
                      item, 
                    ];
                  }
                  return item;
                })
                .flat() 
            }
            onClick={({ key }) => {
              const menuItem = menuSidebar.find((item) => item.key === key);
              if (menuItem?.link) {
                if (menuItem?.key === "log-out") {
                  onLogout();
                }
              }
            }}
          />
          
        </div>
      </Sider>

      <Layout>
        <Header
          className="site-layout-background top-0 sticky z-50	"
          style={{
            padding: 0,
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #E9E9E9",
            height: "90px",
          }}
        >
          <div className="flex flex-row">
            <div className="flex items-center">
              <Button
                type="link"
                onClick={toggleCollapsed}
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Bars4Icon className="text-xl text-gray-800 hover:text-black size-6" />
              </Button>
            </div>
            <div className="md:hidden">
              <Button
                type="link"
                onClick={showDrawer}
                style={{
                  marginLeft: 16,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Bars4Icon className="text-xl text-gray-800 hover:text-black" />
              </Button>
            </div>
            <div className="flex flex-col">
              <Breadcrumb items={breadcrumbItems} />
              <Text className="text-xl font-medium md:text-2xl md:font-medium">
                {activeMenuSidebar?.text}
              </Text>
            </div>
          </div>

          <div className="flex items-center mr-4">
            <Dropdown menu={{ items: menuNavbarItems }} trigger={["click"]} getPopupContainer={(trigger) => trigger.parentElement}>
              <Button
                className="flex items-center bg-gray-100 hover:bg-gray-400 p-8 rounded-xl focus:outline-none focus:shadow-outline hidden sm:flex"
                shape="round"
              >
                <div className="flex items-center justify-between w-full">
                  <Avatar
                    src={profilePicture ? `${API_URL}/${profilePicture}` : null}
                    icon={<UserOutlined />}
                    size={36}
                    className="mr-2"
                  />
                  <div className="flex flex-col items-start mr-2">
                    <Text style={{ fontSize: "14px" }}>{userData?.name}</Text>
                    <Text style={{ fontSize: "12px" }}>{userData?.role}</Text>
                  </div>
                  <ChevronDownIcon className="size-5" />
                </div>
              </Button>
            </Dropdown>
          </div>
        </Header>

        {children}

       
        <Footer />
      </Layout>

      <EditProfile
        open={openEditProfile}
        setOpen={setOpenEditProfile}
        userData={userData}
      />
      <ChangePassword
        open={openChangePassword}
        setOpen={setOpenChangePassword}
      />
    </Layout>
  );
};

export default DashboardLayout;
