import { useState, useEffect } from "react";
import { Button, Form, Input, Modal, Select } from "antd";
import StatusModal from "../StatusModal";
import AddDataIcon from "../../assets/svg/AddData.svg"; // You could use an edit icon here
import Api from "../../services/Api";

const EditData = ({ open, setOpen, fetchData, selectedRecord }) => {
  const [form] = Form.useForm();
  const [modalMessage, setModalMessage] = useState("");
  const [modalStatus, setModalStatus] = useState("");
  const [openStatusModal, setOpenStatusModal] = useState(false);

  useEffect(() => {
    if (open && selectedRecord) {
      form.setFieldsValue({
        full_name: selectedRecord.full_name,
        email: selectedRecord.email,
        role: selectedRecord.role,
        // password is left empty
      });
    }
  }, [open, selectedRecord, form]);

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      // If password is empty, don't send it in the update payload
      const payload = { ...values };
      if (!payload.password) {
        delete payload.password;
      }

      Api.put(`/admins/${selectedRecord.admin_id}`, payload)
        .then(() => {
          setModalStatus("success");
          setModalMessage("Admin has been successfully updated!");
          setOpenStatusModal(true);
          setTimeout(() => {
            setOpenStatusModal(false);
            setOpen(false);
            form.resetFields();
            if (fetchData) fetchData(1, true);
          }, 2000);
        })
        .catch((error) => {
          console.error("Error updating admin:", error);
          setModalStatus("failed");
          const msg = error?.response?.data?.message;
          setModalMessage(Array.isArray(msg) ? msg.join(", ") : (msg || "Failed to update admin data."));
          setOpenStatusModal(true);
          setTimeout(() => setOpenStatusModal(false), 2000);
        });
    }).catch((info) => {
      console.log("Validate Failed:", info);
    });
  };

  return (
    <>
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={AddDataIcon}
              alt="Edit Data"
              className="menu-icon"
              style={{
                marginRight: 10,
                marginBottom: 10,
                height: 40,
                width: 40,
              }}
            />
            <span>Edit Data</span>
          </div>
        }
        centered
        visible={open}
        onCancel={handleCancel}
        width={400}
        maskClosable={false}
        destroyOnClose={true}
        footer={null}
        style={{
          borderRadius: 20,
          overflow: "hidden",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 16 }}
        >
          <hr
            style={{
              flex: 1,
              borderColor: "#E9E9E9",
              margin: 3,
              borderWidth: "1px",
            }}
          />
        </div>

        <Form form={form} layout="vertical" requiredMark={false}>
          <Form.Item
            name="full_name"
            label="Full Name"
            style={{ marginBottom: 10 }}
            rules={[{ required: true, message: "Please enter full name" }]}
          >
            <Input
              style={{ height: 56, borderRadius: 12 }}
              placeholder="Full Name"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            style={{ marginBottom: 10 }}
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input
              style={{ height: 56, borderRadius: 12 }}
              placeholder="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            style={{ marginBottom: 10 }}
            rules={[
              { min: 8, message: "Password must be at least 8 characters" }
            ]}
          >
            <Input.Password
              style={{ height: 56, borderRadius: 12 }}
              placeholder="Leave blank to keep unchanged"
            />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            style={{ marginBottom: 10 }}
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select
              style={{ height: 56, borderRadius: 12 }}
              placeholder="Select Role"
              options={[
                { label: "Admin", value: "admin" },
                { label: "Superadmin", value: "superadmin" },
              ]}
            />
          </Form.Item>

          <div className="mt-7" style={{ textAlign: "center" }}>
            <Button
              onClick={handleCancel}
              style={{
                width: 120,
                height: 40,
                borderColor: "#BBB",
                borderRadius: 12,
                marginRight: 8,
              }}
            >
              <span className="font-medium">Cancel</span>
            </Button>
            <Button
              type="primary"
              onClick={handleSave}
              style={{
                width: 120,
                height: 40,
                borderColor: "#BBB",
                borderRadius: 12,
              }}
            >
              <span className="font-medium"> Save</span>
            </Button>
          </div>
        </Form>
      </Modal>

      <StatusModal
        open={openStatusModal}
        setOpen={setOpenStatusModal}
        message={modalMessage}
        status={modalStatus}
      />
    </>
  );
};

export default EditData;
