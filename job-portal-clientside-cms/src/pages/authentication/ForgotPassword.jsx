import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ConfirmEmail from "../../components/forgot-password/ConfirmEmail";
import OTPVerification from "../../components/forgot-password/OTPVerification";
import ResetPassword from "../../components/forgot-password/ResetPassword";
import ResetSuccessfully from "../../components/forgot-password/ResetSuccessfully";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "confirm-email";
  const [activePage, setActivePage] = useState(page);
  const [email, setEmail] = useState("");

  useEffect(() => {
    setActivePage(page);
  }, [page]);

  const handleNext = (nextPage, email) => {
    if (email) setEmail(email);
    navigate(`?page=${nextPage}`, { replace: true });
  };

  return (
    <div>
      {activePage === "confirm-email" && (
        <ConfirmEmail onFinish={(values) => handleNext("otp-verification", values.email)} onBackToLogin={() => navigate("/login")} />
      )}
      {activePage === "otp-verification" && (
        <OTPVerification email={email} onFinish={() => handleNext("reset-password")} onBackToLogin={() => navigate("/login")} />
      )}
      {activePage === "reset-password" && (
        <ResetPassword onFinish={() => handleNext("reset-successfully")} onBackToLogin={() => navigate("/login")} />
      )}
      {activePage === "reset-successfully" && (
        <ResetSuccessfully onBackToLogin={() => navigate("/login")} />
      )}
    </div>
  );
};

export default ForgotPassword;
