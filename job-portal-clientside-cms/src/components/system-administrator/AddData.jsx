import { useState } from "react";
import { Button, Form, Input, Modal, Select } from "antd";
import StatusModal from "../StatusModal";
import AddDataIcon from "../../assets/svg/AddData.svg";

const AddData = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const [modalMessage, setModalMessage] = useState("");
  const [modalStatus, setModalStatus] = useState("");
  const [openStatusModal, setOpenStatusModal] = useState(false);

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  const handleSave = () => {
    form.validateFields();
  };

  return (
    <>
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={AddDataIcon}
              alt="Add Data"
              className="menu-icon"
              style={{
                marginRight: 10,
                marginBottom: 10,
                height: 40,
                width: 40,
              }}
            />
            <span>Add Data</span>
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

export default AddData;
