import { Button, Form, Input, Row, Col, message } from "antd";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { useJobApply } from "../../pages/job-apply/JobApplyContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EmployeeQuestion = ({ onPrevious, onNext }) => {
  const { formData, updateFormData } = useJobApply();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (formData?.upload_resume == null) {
      navigate("?step=choose-document", { replace: true });
    }
  }, []);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        updateFormData("expected_salary", values.salary);
        updateFormData("experience_years", values.experience_years);
        onNext();
      })
      .catch(() => {
        message.destroy();
        message.error("Please fill out all required fields.");
      });
  };
  return (
    <>
      <div className="flex justify-center">
        <Form
          form={form}
          layout="vertical"
          className="w-full text-right"
          requiredMark={true}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="salary"
                label="What's your expected basic salary?"
                rules={[
                  {
                    required: true,
                    message: "Expected basic salary not be empty",
                  },
                ]}
              >
                <Input
                  prefix="Rp"
                  style={{
                    width: "100%",
                    height: 56,
                    borderRadius: 12,
                    borderColor: "#BBB",
                  }}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                  onChange={(e) => {
                    updateFormData("expected_salary", e.target.value);
                  }}
                  defaultValue={formData?.expected_salary}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="experience_years"
                label="How many years of experience do you have working on this field?"
                rules={[
                  {
                    required: true,
                    message: "Experience year not be empty",
                  },
                ]}
              >
                <Input
                  suffix="Year"
                  style={{
                    width: "100%",
                    height: 56,
                    borderRadius: 12,
                    borderColor: "#BBB",
                  }}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                  onChange={(e) => {
                    updateFormData("experience_years", e.target.value);
                  }}
                  defaultValue={formData?.experience_years}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
      <div className="flex justify-end space-x-4 mt-8">
        <Button
          style={{
            width: 140,
            height: 40,
            borderRadius: 10,
            borderColor: "#BBB",
          }}
          onClick={onPrevious}
        >
          <ArrowLeftIcon className="size-4" />
          <span className="font-medium text-sm">Back</span>
        </Button>
        <Button
          type="primary"
          style={{
            width: 140,
            height: 40,
            borderRadius: 10,
          }}
          onClick={handleSubmit}
        >
          <span className="font-medium text-sm">Continue</span>
          <ArrowRightIcon className="size-4" />
        </Button>
      </div>
    </>
  );
};

export default EmployeeQuestion;
