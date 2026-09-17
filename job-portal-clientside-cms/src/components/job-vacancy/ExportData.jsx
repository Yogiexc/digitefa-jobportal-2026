import { Modal, Form, Input, Button, Select } from "antd";
import Api from "../../services/Api";
import StatusModal from "../StatusModal";
import ExportDataIcon from "../../assets/svg/Export.svg";
import { useState } from "react";
import { saveAs } from "file-saver";

const ExportData = ({ open, setOpen, jobId }) => {
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
        Api.post(`/jobs/${jobId}/applicants/export`, values, {
          responseType: "blob",
        })
          .then((response) => {
            if (values.format === "xlsx") {
              saveAs(response, `applicants-jobs-${jobId}.xlsx`);
            } else if (values.format === "csv") {
              saveAs(response, `applicants-jobs-${jobId}.csv`);
            }
            setModalMessage("Export successful");
            setModalStatus("success");
            form.resetFields();
            setOpen(false);
            setOpenStatusModal(true);
          })
          .catch(() => {
            setModalMessage("Export failed");
            setModalStatus("failed");
            setOpenStatusModal(true);
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
              src={ExportDataIcon}
              alt="Export Data"
              className="menu-icon"
              style={{
                marginRight: 10,
                marginBottom: 10,
                height: 40,
                width: 40,
              }}
            />
            <span>Export Data</span>
          </div>
        }
        centered
        open={open}
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
        <Form
          form={form}
          layout="vertical"
          size="large"
          className="w-full"
          requiredMark={false}
        >
          <Form.Item
            name="format"
            label="Export Format"
            rules={[{ required: true, message: "Please select export format" }]}
          >
            <Select
              style={{ borderColor: "#BBB", height: "56px" }}
              placeholder="Select Export Format"
            >
              <Select.Option value="xlsx">XLSX</Select.Option>
              <Select.Option value="csv">CSV</Select.Option>
            </Select>
          </Form.Item>

          <div className="flex justify-between space-x-2">
            <Form.Item
              name="start"
              label="Start Column"
              rules={[{ required: true, message: "Please enter start column" }]}
            >
              <Input
                placeholder="Enter Start Column"
                style={{ borderRadius: 12 }}
              />
            </Form.Item>

            <Form.Item
              name="end"
              label="End Column"
              rules={[{ required: true, message: "Please enter end column" }]}
            >
              <Input
                placeholder="Enter End Column"
                style={{ borderRadius: 12 }}
              />
            </Form.Item>
          </div>

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
              <span className="font-medium text-sm text-[#232323]">              
                Cancel
              </span>
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
              <span className="font-medium text-sm"> Save </span>
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

export default ExportData;
