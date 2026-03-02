import { Button, Form, Input, Modal, Row, Col, DatePicker, Select } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

import EducationIcon from "../../../assets/svg/Education.svg";
import Api from "../../../services/Api";
import { useEffect, useState } from "react";

const Education = ({
  open,
  setOpen,
  section,
  initialValues,
  resetForm,
  action,
}) => {
  const [form] = Form.useForm();
  const [universities, setUniversities] = useState([]);

  const fetchDataUniversity = async () => {
    console.log(initialValues);
    await Api.get("/universities/list")
      .then((res) => {
        setUniversities(
          res.data.map((univ) => ({
            value: univ.university_name,
            label: univ.university_name,
          }))
        );
      })
      .catch(() => {
        //
      });
  };

  useEffect(() => {
    fetchDataUniversity();
  }, [open]);

  const closed = () => {
    setOpen(section, false);
    form.resetFields();
    resetForm({});
  };

  const handleFinish = async (values) => {
    let { length_of_study, ...payload } = values;
    if (length_of_study) {
      payload = {
        ...payload,
        start_date: length_of_study[0],
        end_date: length_of_study[1],
      };
    }
    await action(section, "put", { values: payload });
    closed();
  };

  const handleCancel = () => {
    closed();
  };

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue({
        ...initialValues,
        length_of_study: initialValues.start_date
          ? [initialValues.start_date, initialValues.end_date]
          : [],
      });
    }
  }, [open, initialValues, form]);

  const values = initialValues?.start_date
    ? {
        ...initialValues,
        length_of_study: [initialValues.start_date, initialValues?.end_date],
      }
    : initialValues;
  const colSpan =
    values && "length_of_study" in values ? { span: 24 } : { span: 12 };

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={EducationIcon}
            alt="Personal Information"
            className="menu-icon"
            style={{ marginRight: 10, marginBottom: 10, height: 40, width: 40 }}
          />
          <span>Education</span>
        </div>
      }
      centered
      visible={open}
      onCancel={handleCancel}
      width={700}
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
        requiredMark={true}
        onFinish={handleFinish}
        className="text-right"
      >
        <Row gutter={16}>
          <Col span={colSpan.span}>
            <Form.Item
              name="university_name"
              label="University"
              rules={[
                { required: true, message: "University name cannot be empty" },
              ]}
            >
              <Select
                showSearch
                style={{ height: 56, borderRadius: 12, textAlign: "left" }}
                placeholder="Search or enter university name"
                optionFilterProp="children"
                options={universities}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                notFoundContent={null}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const inputValue = e.target.value;
                    if (inputValue) {
                      form.setFieldsValue({
                        university_name: inputValue,
                      });
                    }
                  }
                }}
                onSearch={(value) => {
                  if (
                    value &&
                    !universities.find(
                      (uni) => uni.value.toLowerCase() === value.toLowerCase()
                    )
                  ) {
                    form.setFieldsValue({
                      university_name: value,
                    });
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="major"
              label="Major"
              rules={[{ required: true, message: "Major cannot be empty!" }]}
            >
              <Input style={{ borderRadius: 12, height: 56 }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="degree"
              label="Level of Degrees"
              rules={[
                { required: true, message: "Level of Degrees cannot be empty" },
              ]}
            >
              <Input style={{ borderRadius: 12, height: 56 }} />
            </Form.Item>
          </Col>
          {colSpan.span === 24 && (
            <Col span={12}>
              <Form.Item
                name="length_of_study"
                label="Length Of Study"
                getValueProps={(value) => {
                  const [start_date, end_date] = Array.isArray(value)
                    ? value
                    : [];
                  return {
                    value: [dayjs(start_date), dayjs(end_date)],
                  };
                }}
              >
                <DatePicker.RangePicker
                  format={"MMMM YYYY"}
                  picker="month"
                  size="large"
                  className="w-full"
                  style={{ borderRadius: 12, height: 56 }}
                />
              </Form.Item>
            </Col>
          )}
          <Col span={12}>
            <Form.Item
              name="grade"
              label="Grade Point Average (GPA)"
              rules={[
                {
                  required: true,
                  message: "Grade point average cannot be empty",
                },
              ]}
            >
              <Input style={{ borderRadius: 12, height: 56 }} />
            </Form.Item>
          </Col>
          {colSpan.span === 12 && (
            <Col span={12}>
              <Form.Item
                name="start_date"
                label="Start Date"
                getValueProps={(val) => ({ value: dayjs(val) })}
                rules={[
                  { required: true, message: "Please input your start date!" },
                ]}
              >
                <DatePicker
                  format={"MMMM YYYY"}
                  picker="month"
                  size="large"
                  className="w-full"
                  style={{ borderRadius: 12, height: 56 }}
                />
              </Form.Item>
            </Col>
          )}
          {colSpan.span === 12 && (
            <Col span={12}>
              <Form.Item
                name="end_date"
                label="End Date"
                getValueProps={(val) => ({ value: dayjs(val) })}
                rules={[
                  { required: true, message: "Please input your end date!" },
                ]}
              >
                <DatePicker
                  format={"MMMM YYYY"}
                  picker="month"
                  size="large"
                  className="w-full"
                  style={{ borderRadius: 12, height: 56 }}
                />
              </Form.Item>
            </Col>
          )}
        </Row>

        <div style={{ textAlign: "center" }}>
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
            <span className="font-medium">Save</span>
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default Education;
