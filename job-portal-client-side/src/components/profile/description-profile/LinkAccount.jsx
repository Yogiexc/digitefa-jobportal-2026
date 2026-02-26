import { Button, Form, Input, Modal, message } from "antd";
import { useState, useEffect } from "react";
import { LinkIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import Api from "../../../services/Api";
import { getUserSession } from "../../../utils";

const LinkAccount = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isLinked, setIsLinked] = useState(false);

  const getUserProfile = async () => {
    setProfileLoading(true);
    try {
      const user = await getUserSession();
      if (user.role === "job_seeker") {
        const { data } = await Api.get("/profile/my");
        setUserProfile(data);
        setIsLinked(data.user.lmsUserId !== null);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      message.error("Failed to fetch profile information");
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      getUserProfile();
    }
  }, [open]);

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const response = await Api.post("/lms/link-account", {
        email: values.email,
        password: values.password,
      });

      message.success("Account linked successfully!");
      // Refresh profile data after successful linking
      await getUserProfile();
      handleCancel();
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Failed to link account. Please try again.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlink = async () => {
    setLoading(true);
    try {
      await Api.post("/lms/unlink-account");
      message.success("Account unlinked successfully!");
      await getUserProfile();
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Failed to unlink account. Please try again.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderLinkedStatus = () => (
    <div className="text-center py-8">
      <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Account Successfully Linked
      </h3>
      <div className="mb-4 p-4 bg-green-50 rounded-lg">
        <p className="text-sm text-green-700">
          Your Job Portal account is successfully linked with the LMS system.
        </p>
        {userProfile?.user?.lmsLinkedAt && (
          <p className="text-xs text-green-600 mt-2">
            Linked on: {new Date(userProfile.user.lmsLinkedAt).toLocaleString()}
          </p>
        )}
      </div>
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <Button
          onClick={handleCancel}
          style={{
            width: 120,
            height: 40,
            borderRadius: 12,
            borderColor: "#BBB",
            marginRight: 8,
          }}
          disabled={loading}
        >
          <span className="font-medium text-[#232323]">Close</span>
        </Button>
        <Button
          danger
          style={{ 
            width: 120, 
            height: 40, 
            borderRadius: 12,
          }}
          onClick={handleUnlink}
          loading={loading}
        >
          <span className="font-medium">Unlink</span>
        </Button>
      </div>
    </div>
  );

  const renderLinkForm = () => (
    <>
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          Link your Job Portal account with the LMS system to access integrated features and sync your learning progress.
        </p>
      </div>

      <Form
        form={form}
        layout="vertical"
        requiredMark={true}
        onFinish={handleFinish}
        className="text-left"
      >
        <Form.Item
          name="email"
          label="LMS Email"
          rules={[
            { required: true, message: "Email cannot be empty!" },
            { type: "email", message: "Please enter a valid email address!" },
          ]}
        >
          <Input 
            style={{ borderRadius: 12, height: 56 }} 
            placeholder="Enter your LMS email address"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="LMS Password"
          rules={[
            { required: true, message: "Password cannot be empty!" },
            { min: 6, message: "Password must be at least 6 characters!" },
          ]}
        >
          <Input.Password 
            style={{ borderRadius: 12, height: 56 }} 
            placeholder="Enter your LMS password"
          />
        </Form.Item>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Button
            onClick={handleCancel}
            style={{
              width: 120,
              height: 40,
              borderRadius: 12,
              borderColor: "#BBB",
              marginRight: 8,
            }}
            disabled={loading}
          >
            <span className="font-medium text-[#232323]">Cancel</span>
          </Button>
          <Button
            type="primary"
            style={{ 
              width: 120, 
              height: 40, 
              borderRadius: 12,
              backgroundColor: "#1890ff"
            }}
            htmlType="submit"
            loading={loading}
          >
            <span className="font-medium">Link Account</span>
          </Button>
        </div>
      </Form>
    </>
  );

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          {isLinked ? (
            <CheckCircleIcon className="h-6 w-6 mr-3 text-green-600" />
          ) : (
            <LinkIcon className="h-6 w-6 mr-3 text-blue-600" />
          )}
          <span>{isLinked ? "Account Status" : "Link Account"}</span>
        </div>
      }
      centered
      open={open}
      onCancel={handleCancel}
      width={500}
      maskClosable={false}
      destroyOnClose={true}
      footer={null}
      style={{
        borderRadius: 24,
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

      {profileLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading account status...</p>
        </div>
      ) : (
        isLinked ? renderLinkedStatus() : renderLinkForm()
      )}
    </Modal>
  );
};

export default LinkAccount;