import { useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import Api from "../../../services/Api";
import StatusModal from "../../StatusModal";
import AddDataIcon from "../../../assets/svg/AddData.svg";

const AddData = ({ open, setOpen }) => {
  const [modalMessage, setModalMessage] = useState("");
  const [modalStatus, setModalStatus] = useState("");
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        Api.post(`/skills-category`, values)
          .then((res) => {
            const { message, status } = res;
            setModalMessage(message);
            setModalStatus(status === "success" ? "success" : "failed");
            form.resetFields();
            setOpen(false);
            setOpenStatusModal(true);
          })
          .catch((error) => {
            const errorData = error.data?.message;
            form.setFields([{ name: "category_name", errors: [errorData] }]);
          });
      })
      .catch(() => {
        // error handling
      });
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
            name="category_name"
            label="Category Name"
            style={{ marginBottom: 10 }}
            rules={[{ required: true, message: "Please enter category name" }]}
          >
            <Input style={{ height: 56, borderRadius: 12 }} placeholder="Category Name" />
          </Form.Item>

          <div className="mt-7" style={{ textAlign: "center" }}>
            <Button
              onClick={handleCancel}
              style={{
                marginRight: 8,
                width: "120px",
                height: "40px",
                borderRadius: "12px",
                fontWeight: "600",
                fontSize: "14px",
                borderColor: "#BBBBBB",
                borderWidth: "1px",
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleSave}
              style={{
                width: "120px",
                height: "40px",
                borderRadius: "12px",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              Save
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
