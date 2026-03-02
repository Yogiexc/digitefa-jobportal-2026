import { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Input, Form, message } from "antd";
import Api from "../../services/Api";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import LockIcon from "../../assets/svg/Lock.svg";

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  useEffect(() => {
    if (!location.state?.email || !location.state?.otp) { 
      navigate("/forgot-password");
    }
  }, []);

  
  const handleFinish = async (values) => {
    const email = location.state?.email;
    const otp = location.state?.otp;

    if (!email || !otp) {
      message.destroy();
      message.error("Email or OTP not provided. Please register again.");
      return;
    }

    try {
      setLoading(true);
      await Api.post("/auth/reset-password", {
        email,
        otp,
        newPassword: values.newPassword,
      })
        .then(() => {
          message.success("Password reset successfully. Please log in.");
          navigate("/reset-successfully");
        })
        .catch((error) => {
          message.destroy();
          message.error(
            error.data?.message || "Password reset failed. Please try again."
          );
        });
    } catch (error) {
      message.error("Password reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onBackToLogin = () => {
    navigate("/login");
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Reset Password - CMS DIGITEFA </title>
        <meta name="description" content="DIGITEFA" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Helmet>

      <div className="flex min-h-screen items-center justify-center bg-gray-100 py-10">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
          <div className="flex justify-center mb-6">
            <img src={LockIcon} alt="Lock" className="w-16" />
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Reset Password
          </h2>

          <p className="text-base text-gray-400 mb-6">
            Choose a new password for your account.
          </p>
          <Form
            name="resetpassword"
            requiredMark={false}
            layout="vertical"
            size="large"
            className="space-y-3 text-left"
            onFinish={handleFinish}
          >
            {/* FORM PASSWORD */}
            <Form.Item
              name="newPassword"
              label="Password"
              rules={[
                { required: true, message: "Please enter your password" },
                {
                  min: 8,
                  message: "Password must be at least 8 characters",
                },
              ]}
            >
              <div className="relative">
                <Input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Enter Your Password"
                  className="-mt-2 py-2 px-4 border-gray-300 pr-10"
                  style={{height: 56, borderRadius: 12}}
                />
                <div
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? (
                    <EyeIcon className="size-5 text-black" />
                  ) : (
                    <EyeSlashIcon className="size-5 text-black" />
                  )}
                </div>
              </div>
            </Form.Item>

            <Form.Item
              name="confirm_password"
              label="Confirm Password"
              dependencies={["newPassword"]}
              style={{ marginBottom: 40 }}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match!")
                    );
                  },
                }),
              ]}
            >
              <div className="relative">
                <Input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Confirm Your Password"
                  className="py-2 px-4 border-gray-300 pr-10 w-full"
                  style={{height: 56, borderRadius: 12}}
                />
                <div
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? (
                    <EyeIcon className="size-5 text-black" />
                  ) : (
                    <EyeSlashIcon className="size-5 text-black" />
                  )}
                </div>
              </div>
            </Form.Item>

            {/* BUTTON RESET PASSWORD & BACK TO LOGIN */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="h-10 w-full bg-red-500 hover:bg-red-700 text-white font-medium rounded-xl focus:outline-none focus:shadow-outline mb-6 -mt-3"
                loading={loading}
                disabled={loading}
              >
                Reset Password
              </Button>
              <Button
                className="h-10 w-full bg-transparent text-red-500 border border-red-500 font-medium rounded-xl focus:outline-none focus:shadow-outline"
                onClick={onBackToLogin}
              >
                Back to Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default ResetPassword;
