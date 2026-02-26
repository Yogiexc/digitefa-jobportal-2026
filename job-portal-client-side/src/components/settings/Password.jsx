import { useState } from "react";
import { Card, Form, Input, Button, Modal, Typography, message } from "antd";
import {
  EyeIcon,
  EyeSlashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import Api from "../../services/Api";
import { Link } from "react-router-dom";

const { Text } = Typography;

const Password = () => {
  const [form] = Form.useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleSuccess = () => {
    setOpenModal(true);
  };

  const handleOkay = () => {
    form.resetFields();
    setOpenModal(false);
  };

  const handleChangePassword = async (values) => {
    try {
      Api.post("/profile/change-password", values)
        .then(() => {
          handleSuccess();
        })
        .catch((error) => {
          if (error.status === 400) {
            message.destroy();
            message.error("Current password is incorrect. Please try again.");
          }
        });
    } catch (error) {
      message.destroy();
      message.error(
        error.data?.message || "Change Password failed. Please try again."
      );
    }
  };

  return (
    <div className="px-16 py-4">
      <Card className="shadow-lg rounded-2xl">
        <div className="flex justify-between items-center">
          <h2 className="text-[26px] font-semibold">Password</h2>
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
              <p className="text-gray-900 mb-4">
                To enhance the security of your account, please fill in the
                field beside to change your password.
              </p>
              <ul className="list-disc list-inside text-gray-900 mb-4">
                <p className="text-gray-900">
                  Your new password must meet the following criteria:
                </p>
                <li>
                  <span className="font-bold">Minimum Length:</span> 8
                  characters
                </li>
                <li>
                  <span className="font-bold">Uppercase Letters:</span> Include
                  at least one uppercase letter (A-Z)
                </li>
                <li>
                  <span className="font-bold">Lowercase Letters:</span> Include
                  at least one lowercase letter (a-z)
                </li>
                <li>
                  <span className="font-bold">Numbers:</span> At least one
                  number (0-9)
                </li>
                <li>
                  <span className="font-bold">Special Characters:</span> Include
                  at least one special character (e.g., !@#$%^&*)
                </li>
              </ul>
              <p className="text-gray-900 mb-4">
                By adhering to these guidelines, you help to ensure the security
                and integrity of your account, protecting your personal
                information and data from unauthorized access.
              </p>
              <p className="text-gray-900 mb-4">
                If you have any questions or need assistance with creating a
                secure password, please contact our support team.
              </p>
            </div>
            <div className="w-full md:w-1/2 pl-4">
              <Form
                form={form}
                layout="vertical"
                requiredMark={false}
                size="large"
                onFinish={handleChangePassword}
              >
                <Form.Item
                  name="oldPassword"
                  label="Current Password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your current password",
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
                      placeholder="Current Password"
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

                <Form.Item
                  name="newPassword"
                  label="New Password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your new password",
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
                      placeholder="New Password"
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

                <Form.Item
                  name="confirmPassword"
                  label="Confirm Password"
                  dependencies={["newPassword"]}
                  style={{ marginBottom: 40 }}
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your new password",
                    },
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
                      placeholder="Confirm Password"
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
                  <Link to="/forgot-password" className="text-[#0553BA]">
                    Forgot Password
                  </Link>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ borderRadius: 12, height: "40px", width: "140px" }}
                  >
                    <span className="font-medium text-sm">
                      {" "}
                      Change Password{" "}
                    </span>
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        )}
      </Card>
      <Modal
        centered
        visible={openModal}
        width={300}
        maskClosable={false}
        destroyOnClose={true}
        closable={false}
        footer={null}
        style={{
          borderRadius: 24,
          overflow: "hidden",
        }}
      >
        <div className="flex flex-col items-center space-y-4">
          <Text>Password Changed Succesfully</Text>
          <Button
            type="primary"
            onClick={handleOkay}
            style={{ marginRight: 8 }}
          >
            Okay
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Password;
