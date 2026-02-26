import { useState, useEffect } from "react";
import { Button, Form, Input, Modal } from "antd";
import Api from "../../../services/Api";
import StatusModal from "../../StatusModal";
import EditDataIcon from "../../../assets/svg/Edit.svg";

const EditData = ({ open, setOpen, experienceLevelId, fetchData }) => {
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
        Api.put(
          `experience-levels/${experienceLevelId.experience_level_id}`,
          values
        )
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
            form.setFields([{ name: "name", errors: [errorData] }]);
          });
      })
      .catch(() => {
        // error handling
      });
  };
  
  useEffect(() => {
    if (experienceLevelId) {
      form.setFieldsValue({
        name: experienceLevelId.name,
      });
    }
  }, [experienceLevelId]);

  useEffect(() => {
    if (open === false) {
      fetchData(1, true);
    }
  }, [open]);

  return (
    <>
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={EditDataIcon}
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
            name="name"
            label="Experience Year"
            style={{ marginBottom: 10 }}
            rules={[{ required: true, message: "Please enter experience year" }]}
          >
            <Input
              style={{ height: 56, borderRadius: 12 }}
              placeholder="Experience Year"
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
