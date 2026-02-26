import { useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Form, Input, Button, Typography, message } from "antd";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import ChangePasswordIcon from "../../../assets/svg/ChangePassword.svg";
import Api from "../../../services/Api";

const { Text } = Typography;

const ChangePassword = ({ open, setOpen, userData }) => {
  const [form] = Form.useForm();
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const toggleCurrentPasswordVisibility = () => {
    setCurrentPasswordVisible(!currentPasswordVisible);
  };

  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisible(!newPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        Api.post("/profile/change-password", values)
          .then(() => {
            message.success("Password changed successfully");
            setOpen(false);
            form.resetFields();
          })
          .catch((error) => {
            console.error(error);
            message.destroy();
            message.error(error.data.message);
            //setOpen(false);
          });
      })
      .catch(() => {
        // error handling
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={ChangePasswordIcon}
            alt="Edit Data"
            className="menu-icon"
            style={{ marginRight: 10, marginBottom: 10, height: 40, width: 40 }}
          />
          <span>Change Password</span>
        </div>
      }
      centered
      visible={open}
      onCancel={handleCancel}
      width={470}
      maskClosable={false}
      destroyOnClose={true}
      footer={null}
      style={{
        borderRadius: 20,
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <hr
          style={{
            flex: 1,
            borderColor: "#E9E9E9",
            margin: 3,
            borderWidth: "1px",
          }}
        />
      </div>
      <Form
        form={form}
        layout="vertical"
        name="change_password_form"
        requiredMark={false}
        initialValues={{
          password: userData?.password,
        }}
      >
        <Form.Item
          name="oldPassword"
          label="Current Password"
          rules={[
            { required: true, message: "Please enter your current password" },
            {
              min: 8,
              message: "Password must be at least 8 characters",
            },
          ]}
        >
          <div className="relative">
            <Input
              type={currentPasswordVisible ? "text" : "password"}
              placeholder="Enter Your Password"
              className="py-2 px-4 border-gray-300 pr-10 w-full"
              style={{ height: 56, borderRadius: 12 }}
            />
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={toggleCurrentPasswordVisibility}
            >
              {currentPasswordVisible ? (
                <EyeIcon className="size-5 " />
              ) : (
                <EyeSlashIcon className="size-5 " />
              )}
            </div>
          </div>
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[
            { required: true, message: "Please enter  your  new password" },
            {
              min: 8,
              message: "Password must be at least 8 characters",
            },
          ]}
        >
          <div className="relative">
            <Input
              type={newPasswordVisible ? "text" : "password"}
              placeholder="Enter Your New Password"
              className="py-2 px-4 border-gray-300 pr-10 w-full"
              style={{ height: 56, borderRadius: 12 }}
            />
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={toggleNewPasswordVisibility}
            >
              {newPasswordVisible ? (
                <EyeIcon className="size-5" />
              ) : (
                <EyeSlashIcon className="size-5" />
              )}
            </div>
          </div>
        </Form.Item>

        <Form.Item
          name="confirm_password"
          label="Confirm Password"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Please confirm your new password" },
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
              type={confirmPasswordVisible ? "text" : "password"}
              placeholder="Confirm Your New Password"
              className="py-2 px-4 border-gray-300 pr-10 w-full"
              style={{ height: 56, borderRadius: 12 }}
            />
            <div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={toggleConfirmPasswordVisibility}
            >
              {confirmPasswordVisible ? (
                <EyeIcon className="size-5" />
              ) : (
                <EyeSlashIcon className="size-5" />
              )}
            </div>
          </div>
        </Form.Item>

        <div
          className="mt-7"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Text style={{ color: "#0553BA", border: "none" }}>
            <Link to="/forgot-password"> Forgot Password </Link>
          </Text>

          <Button
            type="primary"
            onClick={handleSave}
            style={{
              width: 120,
              height: 40,
              borderRadius: 12,
            }}
          >
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ChangePassword;
