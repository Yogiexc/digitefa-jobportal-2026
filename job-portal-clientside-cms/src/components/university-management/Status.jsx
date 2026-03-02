import { useState, useEffect } from "react";
import { Button, Form, Input, Modal, Select } from "antd";
import Api from "../../services/Api";
import StatusModal from "../StatusModal";
import StatusIcon from "../../assets/svg/Status.svg";

const { TextArea } = Input;

const Status = ({ open, setOpen, universityData, fetchData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalStatus, setModalStatus] = useState("");
  const [openStatusModal, setOpenStatusModal] = useState(false);

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        setLoading(true); 
        Api.post(`/universities/change-status/`, {
          university_id: universityData.university_id,
          status: values.status,
          notes: values.notes,
        })
          .then((res) => {
            const { message, status } = res;
            setModalMessage(message);
            setModalStatus(status === "success" ? "success" : "failed");
            form.resetFields();
            setOpen(false);
            setOpenStatusModal(true);
          })
          .catch(() => {
            // error handling
          });
      })
      .catch(() => {
        // error handling
      });
  };

  useEffect(() => {
    if (universityData) {
      form.setFieldsValue({
        status: universityData.status,
      });
    }
  }, [universityData]);

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
              src={StatusIcon}
              alt="Status"
              className="menu-icon"
              style={{
                marginRight: 10,
                marginBottom: 10,
                height: 40,
                width: 40,
              }}
            />
            <span>Status</span>
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
            name="status"
            label="Status Approval"
            className="font-medium"
            style={{ marginBottom: 10}}
          >
            <Select style={{ height: 56 }} placeholder="Select Status Aprroval">
              <Select.Option value="accepted">
                <span className="text-green-500"> Accepted </span>
              </Select.Option>
              <Select.Option value="rejected">
                <span className="text-red-500"> Rejected </span>
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="notes" label="Notes" style={{ marginBottom: 10 }}>
            <TextArea rows={3} placeholder="Write Your Note Here..." />
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
              loading={loading}
              disabled={loading}
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

export default Status;
