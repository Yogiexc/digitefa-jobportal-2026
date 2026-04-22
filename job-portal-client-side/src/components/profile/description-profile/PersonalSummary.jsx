import { useEffect, useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import PersonalInformationIcon from "../../../assets/svg/Summary.svg";

const { TextArea } = Input;

const PersonalSummary = ({
  open,
  setOpen,
  section,
  initialValues,
  resetForm,
  action,
}) => {
  const [form] = Form.useForm();
  const [inputValue, setInputValue] = useState("");

  const closed = () => {
    resetForm({});
    form.resetFields();
    setOpen(section, false);
  };

  const handleFinish = async () => {
    await form.validateFields().then((values) => {
      action(section, "put", { values });
    });
    closed();
  };

  const handleCancel = () => {
    closed();
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
  if (open && initialValues) {
    form.setFieldsValue(initialValues);
    setInputValue(initialValues.personal_summary || "");
  }
  }, [open, initialValues, form]);

  const characterLimit = 700;
  const isOverLimit = inputValue.length > characterLimit;

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={PersonalInformationIcon}
            alt="Personal Information"
            className="menu-icon"
            style={{ marginRight: 10, marginBottom: 10, height: 40, width: 40 }}
          />
          <span>Personal Summary</span>
        </div>
      }
      centered
      visible={open}
      onCancel={handleCancel}
      width={665}
      // height={365}
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
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleFinish}
        className="text-right flex flex-col"
      >
        <Form.Item
          name="personal_summary"
          label="Personal Summary"
          rules={[
            {
              required: true,
              message: "Please input your personal summary!",
              whitespace: false,
            },
            {
              validator: (_, value) => {
                if (value) {
                  const wordCount = value.trim().split(/\s+/).filter(word => word.length > 0).length;
                  if (wordCount < 3) {
                    return Promise.reject(new Error("Personal summary must contain at least 3 words."));
                  }
                  if (value.length > characterLimit) {
                    return Promise.reject(
                      new Error(
                        `Character limit exceeded! Maximum is ${characterLimit} characters.`
                      )
                    );
                  }
                }
                return Promise.resolve();
              },
            },
          ]}
          validateStatus={isOverLimit ? "error" : undefined}
        >
          <TextArea
            style={{
              borderRadius: 12,
              height: 100,
            }}
            onChange={(e) => {
              setInputValue(e.target.value);
              form.setFieldsValue({ personal_summary: e.target.value });
            }}
          />
        </Form.Item>
        <div className="mt-7" style={{ textAlign: "center" }}>
          <Button
            onClick={handleCancel}
            style={{
              width: 120,
              height: 40,
              borderRadius: 12,
              borderColor: "#BBB",
              marginRight: 8,
            }}
          >
            <span className="font-medium text-[#232323]"> Cancel </span>
          </Button>
          <Button
            type="primary"
            style={{ width: 120, height: 40, borderRadius: 12 }}
            htmlType="submit"
          >
            <span className="font-medium"> Save </span>
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default PersonalSummary;
