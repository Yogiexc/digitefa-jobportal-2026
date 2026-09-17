import {
  ArrowRightStartOnRectangleIcon,
  UserGroupIcon,
  HomeIcon,
  BuildingOfficeIcon,
  IdentificationIcon,
  DocumentDuplicateIcon,
  Cog6ToothIcon,
  AcademicCapIcon,
  FolderIcon,
  BriefcaseIcon,
  UserIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

function getItem(text, label, key, link, icon, role, children) {
  return {
    text,
    label,
    key,
    link,
    icon,
    role,
    children,
  };
}

const MenuSidebar = [
  getItem(
    "Dashboard",
    <Link to="/dashboard">Dashboard</Link>,
    "dashboard",
    "/dashboard",
    <HomeIcon className="size-5" />,
    ["superadmin", "university", "company"]
  ),

  getItem(
    "Master Data",
    "Master Data",
    "master-data",
    "/master-data",
    <FolderIcon className="size-5" />,
    ["superadmin"],
    [
      getItem(
        "Experience Level",
        <Link to={`/experience-level`}>Experience Level</Link>,
        "experience-level",
        "/experience-level",
        null,
        ["superadmin"]
      ),
      getItem(
        "Skills Category",
        <Link to={`/skills-category`}>Skills Category</Link>,
        "skills-category",
        "/skills-category",
        null,
        ["superadmin"]
      ),
    ]
  ),

  getItem(
    "University Management",
    <Link to={`/university-management`}>University Management</Link>,
    "university-management",
    "/university-management",
    <AcademicCapIcon className="size-5" />,
    ["superadmin"]
  ),

  getItem(
    "Company Management",
    <Link to={`/company-management`}>Company Management</Link>,
    "company-management",
    "/company-management",
    <BuildingOfficeIcon className="size-5" />,
    ["superadmin"]
  ),


  getItem(
    "Profile Company",
    <Link to={`/profile-company`}>Profile Company</Link>,
    "profile-company",
    "/profile-company",
    <UserIcon className="size-5" />,
    ["company"]
  ),

  getItem(
    "Job Vacancy",
    <Link to={`/job-vacancy`}>Job Vacancy</Link>,
    "job-vacancy",
    "/job-vacancy",
    <BriefcaseIcon className="size-5" />,
    ["company"]
  ),

  getItem(
    "Interviews",
    <Link to={`/interviews`}>Interviews</Link>,
    "interviews",
    "/interviews",
    <UserGroupIcon className="size-5" />,
    [""]
  ),

  getItem(
    "Content",
    "Content",
    "content",
    "/content",
    <DocumentDuplicateIcon className="size-5" />,
    ["superadmin"],
    [
      getItem(
        "About Us",
        <Link to={`/about-us`}>About Us</Link>,
        "about-us",
        "/about-us",
        null,
        ["superadmin"]
      ),
      getItem(
        "Event & News",
        <Link to={`/event-news`}>Event & News</Link>,
        "event-news",
        "/event-news",
        null,
        ["superadmin"]
      ),
      getItem(
        "Privacy Policy",
        <Link to={`/privacy-policy`}>Privacy Policy</Link>,
        "privacy-policy",
        "/privacy-policy",
        null,
        ["superadmin"]
      ),
    ]
  ),

  getItem(
    "User Management",
    "User Management",
    "user-management",
    "/user-management",
    <UserGroupIcon className="size-5" />,
    ["superadmin"],
    [
      getItem(
        "Job Seeker",
        <Link to={`/job-seeker`}>Job Seeker</Link>,
        "job-seeker",
        "/job-seeker",
        null,
        ["superadmin"]
      ),
      getItem(
        "Company",
        <Link to={`/company`}>Company</Link>,
        "company",
        "/company",
        null,
        ["superadmin"]
      ),
      getItem(
        "University",
        <Link to={`/university`}>University</Link>,
        "university",
        "/university",
        null,
        ["superadmin"]
      ),
    ]
  ),

  getItem(
    "System administrator",
    <Link to={`/system-administrator`}>System Administrator</Link>,
    "system-administrator",
    "/system-administrator",
    <Cog6ToothIcon className="size-5" />,
    ["superadmin"]
  ),

  getItem(
    "Profile University",
    <Link to={`/profile-university`}>Profile University</Link>,
    "profile-university",
    "/profile-university",
    <UserIcon className="size-5" />,
    ["university"]
  ),

  getItem(
    "Student Management",
    "Student Management",
    // <Link to={`/student-management`}>Student Management</Link>,
    "student-management",
    "/student-management",
    <IdentificationIcon className="size-5" />,
    ["university"],
    [
      getItem(
        "Registered Student",
        <Link to={`/registered-student`}>Registered Student</Link>,
        "registered-student",
        "/registered-student",
        null,
        ["university"]
      ),
      getItem(
        "Student Employment History",
        <Link to={`/student-employment-history`}>Student Employment History</Link>,
        "student-employment-history",
        "/student-employment-history",
        null,
        ["university"]
      )
    ]
  ),

  getItem(
    "Secure-Log",
    <Link to="/secure-log">Secure-Log</Link>,
    "secure-log",
    "/secure-log",
    <ShieldCheckIcon className="size-5" />,
    ["superadmin"]
  ),
 
  getItem(
    "Log Out",
    <Link to={`/logout`}>Logout</Link>,
    "log-out",
    "/log-out",
    <ArrowRightStartOnRectangleIcon className="size-5" />,
    ["superadmin", "university", "company"]
  ),

];

export default MenuSidebar;
