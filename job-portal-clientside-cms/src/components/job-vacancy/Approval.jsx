import { useEffect, useState } from "react";
import { App, Button, DatePicker, Form, Input, Modal, Select } from "antd";
import Api from "../../services/Api";
import StatusModal from "../StatusModal";
import ApprovalIcon from "../../assets/svg/Status.svg";

const normalizeStatus = (status) =>
  (status || "pending").toLowerCase().replace(/\s+/g, "_");

const isInterviewStageStatus = (status) =>
  ["waiting_interview", "interviewing", "accepted", "rejected"].includes(
    status
  );

const Approval = ({
  open,
  setOpen,
  applicantsData,
  fetchData,
  onStatusUpdated,
}) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [modalMessage, setModalMessage] = useState("");
  const [modalStatus, setModalStatus] = useState("");
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [approvalStage, setApprovalStage] = useState("schedule");
  const [saving, setSaving] = useState(false);

  const normalizedStatus = normalizeStatus(applicantsData?.status);
  const isDecisionStage = approvalStage === "decision";
  const modalTitle = isDecisionStage ? "Final Approval" : "Schedule Interview";

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  const openFeedbackModal = (status, message) => {
    setModalMessage(message);
    setModalStatus(status === "success" ? "success" : "failed");
    setOpenStatusModal(true);
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        setSaving(true);
        const payload = {
          status: isDecisionStage ? values.status : "waiting_interview",
        };

        if (!isDecisionStage) {
          payload.interview_date = values.interview_date
            ? values.interview_date.format("YYYY-MM-DDTHH:mm")
            : null;
          payload.meeting_link = values.meeting_link;
          payload.notes = values.notes;
        }

        Api.put(
          `/jobs/applicants/change-status/${applicantsData.application_id}`,
          payload
        )
          .then((res) => {
            onStatusUpdated?.(applicantsData.application_id, payload.status);

            if (isDecisionStage) {
              form.resetFields();
              setOpen(false);
              openFeedbackModal(res.status, res.message);
              return;
            }

            setApprovalStage("decision");
            form.resetFields();
            message.success(
              "Interview schedule saved. You can now choose accepted or rejected."
            );
          })
          .catch((error) => {
            openFeedbackModal(
              "failed",
              error?.data?.message || "Failed to update application status"
            );
          })
          .finally(() => {
            setSaving(false);
          });
      })
      .catch(() => {
        setSaving(false);
        // Validation message is handled by the form.
      });
  };

  useEffect(() => {
    if (!open || !applicantsData) {
      return;
    }

    const nextStage = isInterviewStageStatus(normalizedStatus)
      ? "decision"
      : "schedule";

    setApprovalStage(nextStage);
    form.resetFields();

    if (nextStage === "decision" && ["accepted", "rejected"].includes(normalizedStatus)) {
      form.setFieldsValue({ status: normalizedStatus });
    }
  }, [applicantsData, form, normalizedStatus, open]);

  useEffect(() => {
    if (open === false) {
      fetchData(1, true);
    }
  }, [fetchData, open]);

  return (
    <>
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={ApprovalIcon}
              alt="Approval"
              className="menu-icon"
              style={{
                marginRight: 10,
                marginBottom: 10,
                height: 40,
                width: 40,
              }}
            />
            <span>{modalTitle}</span>
          </div>
        }
        centered
        open={open}
        onCancel={handleCancel}
        width={400}
        maskClosable={false}
        destroyOnClose
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

        <Form form={form} layout="vertical" requiredMark={false}>
          {!isDecisionStage && (
            <>
              <Form.Item
                name="interview_date"
                label="Interview Date & Time"
                rules={[
                  {
                    required: true,
                    message: "Please enter interview date",
                  },
                ]}
              >
                <DatePicker
                  showTime
                  style={{ width: "100%", height: 40 }}
                  format="YYYY-MM-DD HH:mm"
                />
              </Form.Item>

              <Form.Item name="meeting_link" label="Meeting Link">
                <Input
                  placeholder="Enter meeting link"
                  style={{ height: 40 }}
                />
              </Form.Item>

              <Form.Item name="notes" label="Interview Notes">
                <Input.TextArea
                  rows={4}
                  placeholder="Add notes for the interview"
                />
              </Form.Item>
            </>
          )}

          {isDecisionStage && (
            <>
              <div className="mb-4 rounded-xl bg-[#FFF7E8] px-4 py-3 text-sm text-[#B26A00]">
                Interview has been scheduled. Please choose the final approval
                status for this applicant.
              </div>

              <Form.Item
                name="status"
                label="Status Approval"
                style={{ marginBottom: 10 }}
                rules={[
                  {
                    required: true,
                    message: "Please select status approval",
                  },
                ]}
              >
                <Select
                  style={{ height: 56 }}
                  placeholder="Select status approval"
                >
                  <Select.Option value="accepted">
                    <span className="text-green-500"> Accepted </span>
                  </Select.Option>
                  <Select.Option value="rejected">
                    <span className="text-red-500"> Rejected </span>
                  </Select.Option>
                </Select>
              </Form.Item>
            </>
          )}

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
              loading={saving}
              style={{
                width: "140px",
                height: "40px",
                borderRadius: "12px",
              }}
            >
              <span className="font-medium">
                {isDecisionStage ? "Save Status" : "Schedule Interview"}
              </span>
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
