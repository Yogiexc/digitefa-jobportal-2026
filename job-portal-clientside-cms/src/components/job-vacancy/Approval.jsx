import { useEffect, useState } from "react";
import { Button, Form, Modal, Select } from "antd";
import Api from "../../services/Api";
import StatusModal from "../StatusModal";
import ApprovalIcon from "../../assets/svg/Status.svg";

const Approval = ({ open, setOpen, applicantsData, fetchData }) => {
  const [form] = Form.useForm();
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
        Api.put(`/jobs/applicants/change-status/${applicantsData}`, {
          status: values.status,
        })
          .then((res) => {
            const { message, status } = res;
            form.resetFields();
            setOpen(false);
            setModalMessage(message);
            setModalStatus(status === "success" ? "success" : "failed");
            setOpenStatusModal(true);
          })
          .catch(() => {
            // error handling
          })
          .finally(() => {
            // setLoading(false);
          });
      })
      .catch(() => {
        // error handling
      });
  };

  useEffect(() => {
    if (applicantsData) {
      form.setFieldsValue({
        status: applicantsData.status,
      });
    }
  }, [applicantsData]);

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
              src={ApprovalIcon}
              alt="Add Data"
              className="menu-icon"
              style={{
                marginRight: 10,
                marginBottom: 10,
                height: 40,
                width: 40,
              }}
            />
            <span>Approval</span>
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
            style={{ marginBottom: 10 }}
            rules={[
              { required: true, message: "Please select status aprroval" },
            ]}
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

          <div className="mt-7" style={{ textAlign: "center" }}>
            <Button
              onClick={handleCancel}
              style={{
                marginRight: 8,
                width: "120px",
                height: "40px",
                borderRadius: "12px",
                borderColor: "#BBBBBB",
                borderWidth: "1px",
              }}
            >
              <span className="font-medium"> Cancel </span>
            </Button>
            <Button
              type="primary"
              onClick={handleSave}
              style={{
                width: "120px",
                height: "40px",
                borderRadius: "12px",
              }}
            >
              <span className="font-medium"> Save </span>
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

export default Approval;
