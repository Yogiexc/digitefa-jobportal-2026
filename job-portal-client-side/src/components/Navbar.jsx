import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  Menu,
  Button,
  Layout,
  Dropdown,
  Divider,
  Drawer,
  message,
  Typography,
} from "antd";
import {
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  BriefcaseIcon,
  ChevronDownIcon,
  ClipboardDocumentCheckIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Logo from "../assets/svg/Digitefa.svg";
import { getUserSession, previewImageUrl } from "../utils";
import Api from "../services/Api";
import { useOnMountUnsafe } from "../hooks/useMountUnsave";
import { UserOutlined } from "@ant-design/icons";
import { useUserContext } from "../UserContext";

const { Header } = Layout;
const { Text } = Typography;

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, setUserData, personalInfo, setPersonalInfo } =
    useUserContext();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const cmsUrl = import.meta.env.VITE_CMS_URL;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    message.success("Logged out successfully!");
    setUserData(null);
    navigate("/");
  };

  const imageUrl = previewImageUrl({
    patch: "LOGO",
    url_image: personalInfo?.profile?.profile_picture_url,
  });
  const getUserInfo = async () => {
    try {
      const user = await getUserSession();
      let profile = {};
      if (user.role === "job_seeker") {
        const { data } = await Api.get("/profile/job-seeker/personal-info");
        profile = data;
      }
      setPersonalInfo({ user, profile });
    } catch (error) {
      message.error(error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  useOnMountUnsafe(getUserInfo);

  const menuNavbar = (
    <Menu className="absolute">
      <div className="flex items-center p-4">
        <Avatar src={imageUrl} icon={<UserOutlined />} size={48} />
        <div className="ml-3">
          <div className="font-bold">{userData?.name}</div>
          <div className="text-gray-500">{userData?.email}</div>
        </div>
      </div>
      <Divider className="my-2" />
      <Menu.Item key="profile" icon={<UserCircleIcon className="size-5" />}>
        <Link to="/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item
        key="recommended-jobs"
        icon={<ClipboardDocumentCheckIcon className="size-5" />}
      >
        <Link to="/recommended-jobs">Recommended Jobs</Link>
      </Menu.Item>
      <Menu.Item key="saved-jobs" icon={<BriefcaseIcon className="size-5" />}>
        <Link to="/saved-jobs">Saved Jobs</Link>
      </Menu.Item>
      <Menu.Item
        key="job-history"
        icon={<DocumentDuplicateIcon className="size-5" />}
      >
        <Link to="/job-application-history">Job Application History</Link>
      </Menu.Item>
      <Menu.Item key="settings" icon={<Cog6ToothIcon className="size-5" />}>
        <Link to="/settings">Settings</Link>
      </Menu.Item>
      <Divider className="my-2" />
      <Menu.Item
        key="logout"
        icon={<ArrowRightStartOnRectangleIcon className="size-5" />}
        onClick={handleLogout}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  const menuNavbarMobile = (
    <Menu>
      <Divider className="my-2" />
      <div className="flex items-start p-4">
        <div>
          <Avatar src={imageUrl} icon={<UserOutlined />} size={48} />
        </div>
        <div className="ml-3 flex flex-col">
          <Text className="font-bold">{userData?.name}</Text>
          <Text className="text-gray-500">{userData?.email}</Text>
        </div>
      </div>
      <Divider className="my-2" />
      <Menu.Item key="profile" icon={<UserCircleIcon className="size-5" />}>
        <Link to="/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="saved-jobs" icon={<BriefcaseIcon className="size-5" />}>
        <Link to="/saved-jobs">Saved Jobs</Link>
      </Menu.Item>
      <Menu.Item
        key="job-history"
        icon={<DocumentDuplicateIcon className="size-5" />}
      >
        <Link to="/job-application-history">Job Application History</Link>
      </Menu.Item>
      <Menu.Item key="settings" icon={<Cog6ToothIcon className="size-5" />}>
        <Link to="/settings">Settings</Link>
      </Menu.Item>
      <Divider className="my-2" />
      <Menu.Item
        key="logout"
        icon={<ArrowRightStartOnRectangleIcon className="size-5" />}
        onClick={handleLogout}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  const mobileMenu = (
    <Menu mode="vertical">
      <Menu.Item key="/" className="flex items-center">
        <Link to="/" className="text-black">
          Home
        </Link>
      </Menu.Item>
      <Menu.Item key="/find-jobs" className="flex items-center">
        <Link to="/find-jobs" className="text-black">
          Find Jobs
        </Link>
      </Menu.Item>
      <Menu.Item key="/for-company-university" className="flex items-center">
        <a href={cmsUrl} className="text-black">
          For Company / University
        </a>
      </Menu.Item>
      {userData ? (
        menuNavbarMobile
      ) : (
        <Link to="/login">
          <Button
            type="primary"
            className="mt-4 w-full bg-green-600 text-white rounded-md"
          >
            Sign In
          </Button>
        </Link>
      )}
    </Menu>
  );

  return (
    <Header
      className="top-0 sticky z-50 w-full bg-white border-b border-gray-200 px-5 md:px-12"
      style={{
        background: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100px",
      }}
    >
      <div>
        <Link to="/">
          <img src={Logo} alt="DIGITEFA" className="w-36 md:w-36" />
        </Link>
      </div>

      <Menu
        theme="light"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        className="flex-1 justify-center bg-transparent border-b-0 hidden md:flex"
      >
        <Menu.Item key="/" className="flex items-center">
          <Link to="/" className="text-black">
            Home
          </Link>
        </Menu.Item>

        <Menu.Item key="/find-jobs" className="flex items-center">
          <Link to="/find-jobs" className="text-black">
            Find Jobs
          </Link>
        </Menu.Item>
      </Menu>

      <div className="flex items-center">
        {!userData ? (
          <Button
            type="button"
            className="bg-white text-[#06A73B] border-none hover:text-[#06A73B] hidden md:flex"
            href={cmsUrl}
          >
            For Company / University
          </Button>
        ) : null}

        {userData ? (
          <Dropdown
            overlay={menuNavbar}
            trigger={["click"]}
            getPopupContainer={(trigger) => trigger.parentElement}
          >
            <Button
              type="primary"
              className="group flex items-center bg-[#E9E9E9] hover:bg-gray-500 py-7  rounded-xl focus:outline-none focus:shadow-outline hidden md:flex"
              shape="round"
            >
              <div className="flex justify-between items-center">
                <Avatar
                  src={imageUrl}
                  icon={<UserOutlined />}
                  size={32}
                  className="mr-6"
                />
                <ChevronDownIcon className="text-black group-hover:text-white size-5" />
              </div>
            </Button>
          </Dropdown>
        ) : (
          <Link to="/login">
            <Button
              type="primary"
              className="w-[131px] h-[48px] rounded-[12px] bg-green-600 border-green-500 text-white hover:bg-white hover:text-green-600 hidden md:flex"
            >
              Sign In
            </Button>
          </Link>
        )}
      </div>
      <Button
        type="primary"
        className=" md:hidden px-4 py-5 rounded-lg"
        onClick={() => setDrawerVisible(true)}
      >
        <Bars3Icon className="size-7" />
      </Button>
      <Drawer
        title={<img src={Logo} alt="Digitefa" className="ml-2 w-24" />}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
      >
        {mobileMenu}
      </Drawer>
    </Header>
  );
};

export default Navbar;
