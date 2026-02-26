import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";

// SUPERADMIN, COMPANY AND UNIVERSITY
import Login from "../pages/authentication/Login";
import Register from "../pages/authentication/Register";
import ForgotPassword from "../pages/authentication/ForgotPassword";
import ConfirmEmail from "../components/forgot-password/ConfirmEmail";
import OTPVerification from "../components/forgot-password/OTPVerification";
import ResetPassword from "../components/forgot-password/ResetPassword";
import ResetSuccessfully from "../components/forgot-password/ResetSuccessfully";
import Dashboard from "../pages/dashboard/Dashboard";

// SUPERADMIN
import ExperienceLevel from "../pages/master-data/ExperienceLevel";
import Skills from "../pages/master-data/Skills";
import UniversityManagement from "../pages/university-management/UniversityManagement";
import CompanyManagement from "../pages/company-management/CompanyManagement";
import Talents from "../pages/talents/Talents";
import AboutUs from "../pages/content/AboutUs";
import EventNews from "../pages/content/EventNews";
import PrivacyPolicy from "../pages/content/PrivacyPolicy";
import JobSeeker from "../pages/user-management/JobSeeker";
import University from "../pages/user-management/University";
import Company from "../pages/user-management/Company";
import SystemAdministrator from "../pages/system-administrator/SystemAdministrator";

// UNIVERSITY
import ProfileUniversity from "../pages/profile/ProfileUniversity";
import RegisteredStudent from "../pages/student-management/RegisteredStudent";
import StudentEmploymentHistory from "../pages/student-management/StudentEmploymentHistory";
import VerificationSuccessfullyUniversity from "../components/profile/university/VerificationSuccessfullyUniversity";
import FillDataUniversity from "../components/profile/university/FillDataUniversity";
import FillProfileUniversity from "../components/profile/university/FillProfileUniversity";

// COMPANY
import ProfileCompany from "../pages/profile/ProfileCompany";
import JobVacancy from "../pages/job-vacancy/JobVacancy";
import VerificationSuccessfullyCompany from "../components/profile/company/VerificationSuccessfullyCompany";
import FillDataCompany from "../components/profile/company/FileDataCompany";
import FillProfileCompany from "../components/profile/company/FillProfileCompany";

// UNIVERSITY AND COMPANY
import VerificationAccount from "../pages/authentication/VerificationAccount";
import ProfileCompleted from "../components/profile/ProfileCompleted";
import RequestProfile from "../components/profile/RequestProfile";
import SecureLog from "../pages/secure-log/SecureLog";

function checkAuthorization(roleRequired, userRole) {
  return roleRequired.includes(userRole);
}

function ProtectedRoute({ requiredRole }) {
  const location = useLocation();
  const token =
    sessionStorage.getItem("token") || localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" />;
  }

  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const userRole = userData?.role;
  if (
    location.pathname != "/fill-data-company" &&
    location.pathname != "/fill-data-university" &&
    location.pathname != "/fill-profile-company" &&
    location.pathname != "/fill-profile-university" &&
    location.pathname != "/request-profile"
  ) {
    if (userData?.status === "submitted") {
      return <Navigate to="/request-profile" />;
    } else if (userData?.status === "not_submitted") {
      if (userData?.role === "company") {
        return <Navigate to="/fill-data-company" />;
      } else if (userData?.role === "university") {
        return <Navigate to="/fill-data-university" />;
      }
    }
  }

  if (!checkAuthorization(requiredRole, userRole)) {
    return <Navigate to="/dashboard" />;
  }
  return <Outlet />;
}

function AuthRoute() {
  const token =
    sessionStorage.getItem("token") || localStorage.getItem("token");
  const location = useLocation();

  if (token && location.pathname !== "/forgot-password") {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
}

function RoutesIndex() {
  return (
    <Routes>
      <Route element={<AuthRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-successfully" element={<ResetSuccessfully />} />
        <Route path="/verification-account" element={<VerificationAccount />} />
      </Route>

      <Route
        element={
          <ProtectedRoute
            requiredRole={["superadmin", "company", "university"]}
          />
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route element={<ProtectedRoute requiredRole={["superadmin"]} />}>
        <Route path="/experience-level" element={<ExperienceLevel />} />
        <Route path="/skills-category" element={<Skills />} />
        <Route
          path="/university-management"
          element={<UniversityManagement />}
        />
        <Route path="/company-management" element={<CompanyManagement />} />
        <Route path="/talents" element={<Talents />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/event-news" element={<EventNews />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/job-seeker" element={<JobSeeker />} />
        <Route path="/company" element={<Company />} />
        <Route path="/university" element={<University />} />
        <Route path="/system-administrator" element={<SystemAdministrator />} />
        <Route path="/secure-log" element={<SecureLog />} />
      </Route>

      <Route
        element={<ProtectedRoute requiredRole={["university", "company"]} />}
      >
        <Route path="/profile-completed" element={<ProfileCompleted />} />
        <Route path="/request-profile" element={<RequestProfile />} />
      </Route>

      <Route
        element={<ProtectedRoute requiredRole={["superadmin", "company"]} />}
      ></Route>

      <Route element={<ProtectedRoute requiredRole={["university"]} />}>
        <Route path="/profile-university" element={<ProfileUniversity />} />
        <Route path="/registered-student" element={<RegisteredStudent />} />
        <Route
          path="/student-employment-history"
          element={<StudentEmploymentHistory />}
        />
        <Route
          path="/verification-successfully-university"
          element={<VerificationSuccessfullyUniversity />}
        />
        <Route path="/fill-data-university" element={<FillDataUniversity />} />
        <Route
          path="/fill-profile-university"
          element={<FillProfileUniversity />}
        />
      </Route>

      <Route element={<ProtectedRoute requiredRole={["company"]} />}>
        <Route path="/profile-company" element={<ProfileCompany />} />
        <Route path="/job-vacancy" element={<JobVacancy />} />
        <Route
          path="/verification-successfully-company"
          element={<VerificationSuccessfullyCompany />}
        />
        <Route path="/fill-data-company" element={<FillDataCompany />} />
        <Route path="/fill-profile-company" element={<FillProfileCompany />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default RoutesIndex;
