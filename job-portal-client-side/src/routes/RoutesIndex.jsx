import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "../pages/authentication/Login";
import Register from "../pages/authentication/Register";
import ForgotPassword from "../pages/authentication/ForgotPassword";
import VerificationAccount from "../pages/authentication/VerificationAccount";
import Home from "../pages/home/Home";
import FindJobs from "../pages/find-jobs/FindJobs";
import Profile from "../pages/profile/Profile";
import VerificationSuccessfully from "../components/register/VerificationSuccessfully";
import SavedJobs from "../pages/saved-jobs/SavedJobs";
import JobApplicationHistory from "../pages/job-application-history/JobApplicationHistory";
import Settings from "../pages/settings/Settings";
import CompanyDetail from "../pages/company-detail/CompanyDetail";
import JobDetail from "../pages/job-detail/JobDetail";
import AboutUs from "../pages/about-us/AboutUs";
import PrivacyPolicy from "../pages/privacy-policy/PrivacyPolicy";
import EventNews from "../pages/event-news/EventNews";
import JobApply from "../pages/job-apply/JobApply";
import DetailEventNews from "../pages/event-news/DetailEventNews";
import PagesNotFound from "../pages/PagesNotFound";
import RecommendedJobs from "../pages/recommended-jobs/RecommendedJobs";

function AuthMiddleware() {
  const token = localStorage.getItem("token") || localStorage.getItem("token");

  if (token) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}

function ProtectedAuthMiddleware() {
  const token = localStorage.getItem("token") || localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

function RoutesIndex() {
  return (
    <Routes>
      <Route element={<AuthMiddleware />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedAuthMiddleware />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/saved-jobs" element={<SavedJobs />} />
        <Route path="/recommended-jobs" element={<RecommendedJobs />} />
        <Route
          path="/job-application-history"
          element={<JobApplicationHistory />}
        />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="/" element={<Home />} />
      <Route path="/find-jobs" element={<FindJobs />} />
      <Route path="/verification-account" element={<VerificationAccount />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/verification-successfully"
        element={<VerificationSuccessfully />}
      />
      <Route path="/jobs/:jobId" element={<JobDetail />} />
      <Route path="/jobs/:jobId/apply" element={<JobApply />} />
      <Route path="/company/:companyId" element={<CompanyDetail />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/event-news" element={<EventNews />} />
      <Route path="/event-news/:slug" element={<DetailEventNews />} />

      <Route path="*" element={<PagesNotFound />} />
    </Routes>
  );
}

export default RoutesIndex;
