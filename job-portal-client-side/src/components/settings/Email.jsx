import { useEffect, useState } from "react";
import { Card, Form, Input, Button, message } from "antd";
import {
  EyeIcon,
  EyeSlashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import Api from "../../services/Api";
import { InputOTP } from "antd-input-otp";
import { Link } from "react-router-dom";

const Email = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleChangeEmail = async (values) => {
    setLoading(true);
    try {
      const data = {
        newEmail: values.newEmail,
        password: values.password,
      };
      const response = await Api.post("/profile/change-email", data);
      message.success(
        "Email OTP sent successfully. Please check your email for the OTP code."
      );
      setOtpSent(true);
      console.log("Email change response:", response);
    } catch (error) {
      if (error.response && error.response.data) {
        message.error(error.response.data.message || "Error sending OTP");
      } else {
        message.error("Error sending OTP");
      }
      console.error("Email change error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const otpCode = otpValue.join("");
      const response = await Api.post("/profile/verify-change-email", {
        newEmail: form.getFieldValue("newEmail"),
        otp: otpCode,
      });
      message.success("Email changed successfully!");
      console.log("OTP verification response:", response);
      // Additional steps after successful verification (e.g., redirect)
    } catch (error) {
      if (error.response && error.response.data) {
        message.error(error.response.data.message || "Error verifying OTP");
      } else {
        message.error("Error verifying OTP");
      }
      console.error("OTP verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-16 py-4">
      <Card className="shadow-lg rounded-2xl">
        <div className="flex justify-between items-center">
          <h2 className="text-[26px] font-semibold">Email</h2>
          <Button
            style={{ borderColor: "#06A73B", borderRadius: 12 }}
            type="text"
            onClick={toggleCollapse}
            icon={
              collapsed ? (
                <ChevronDownIcon className="size-5 text-[#06A73B]" />
              ) : (
                <ChevronUpIcon className="size-5 text-[#06A73B]" />
              )
            }
          />
        </div>

        {!collapsed && (
          <div className="flex mt-4">
            <div className="w-full md:w-1/2 pr-4">
              <p className="text-[#232323] mb-4">
                To enhance the security of your account, please fill in the
                field beside to change your email
              </p>
              <ul className="list-disc list-inside text-[#232323] mb-4">
                <p className="text-[#232323]">
                  Your new email address must meet the following criteria:
                </p>
                <li>
                  <span className="font-bold">Valid Email Address:</span> Ensure
                  the email address is correctly formatted.
                </li>
                <li>
                  <span className="font-bold">Active Email:</span> The email
                  address should be active and accessible for verification
                  purposes (e.g., username@gmail.com).
                </li>
                <li>
                  <span className="font-bold">Unique Email:</span> The email
                  address must not be already in use by another account.
                </li>
              </ul>
              <p className="text-[#232323] mb-4">
                If you have any questions or need assistance with changing your
                email address, please contact our support team.
              </p>
            </div>

            <div className="w-full md:w-1/2 pl-4">
              {!otpSent ? (
                <Form
                  form={form}
                  layout="vertical"
                  requiredMark={false}
                  size="large"
                  onFinish={handleChangeEmail}
                >
                  <Form.Item name="email" label="Current Email">
                    <div className="relative">
                      <Input
                        style={{ borderColor: "#BBBBBB" }}
                        value={userData?.email}
                        disabled
                      />
                    </div>
                  </Form.Item>

                  <Form.Item
                    name="newEmail"
                    label="New Email"
                    rules={[
                      {
                        required: true,
                        type: "email",
                        message: "Please enter your new email!",
                      },
                    ]}
                  >
                    <div className="relative">
                      <Input
                        placeholder="Enter Your New Email"
                        style={{ borderColor: "#BBB" }}
                      />
                    </div>
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your password!",
                      },
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
                        style={{ borderColor: "#BBB" }}
                      />
                      <div
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        onClick={togglePasswordVisibility}
                      >
                        {passwordVisible ? (
                          <EyeIcon className="size-5" />
                        ) : (
                          <EyeSlashIcon className="size-5" />
                        )}
                      </div>
                    </div>
                  </Form.Item>

                  <div className="flex justify-between items-center">
                    <a href="/forgot-password" className="text-[#0553BA]">
                      Forgot Password
                    </a>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{
                        borderRadius: 12,
                        height: "40px",
                        width: "140px",
                      }}
                      loading={loading}
                    >
                      <span className="font-medium text-sm">                        
                        Change Email
                      </span>
                    </Button>
                  </div>
                </Form>
              ) : (
                <div className="flex flex-col items-center justify-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  OTP Verification
                </h2>
              
                <Form
                  form={form}
                  layout="vertical"
                  requiredMark={false}
                  size="large"
                  onFinish={handleVerifyOtp}
                  className="w-full max-w-md"
                >
                  <Form.Item
                    name="otpverification"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the OTP",
                      },
                    ]}
                    className="flex justify-center"
                  >
                    <InputOTP
                      onChange={setOtpValue}
                      value={otpValue}
                      inputType="numeric"
                      length={4}
                      style={{
                        input: {
                          border: "2px solid #dc362e",
                          borderRadius: "4px",
                          margin: "0 5px",
                          width: "50px",
                          height: "50px",
                          fontSize: "24px",
                          textAlign: "center",
                        },
                      }}
                    />
                  </Form.Item>
              
                  <p className="text-gray-700 text-sm text-center">
                    Didn’t receive the code?
                    <a
                      onClick={handleChangeEmail}
                      className="text-blue-500 hover:underline ml-1 cursor-pointer"
                    >
                      Resend
                    </a>
                  </p>
              
                  <Form.Item className="flex flex-col items-center">
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ width: 400, height: 40, borderRadius: 12 }}
                      loading={loading}
                      disabled={loading}
                      className="mb-4"
                    >
                      Verify
                    </Button>
                    <Link to="/register">
                      <Button
                        style={{ width: 400, height: 40, borderRadius: 12 }}
                      >
                        Back to login
                      </Button>
                    </Link>
                  </Form.Item>
                </Form>
              </div>
              
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Email;
