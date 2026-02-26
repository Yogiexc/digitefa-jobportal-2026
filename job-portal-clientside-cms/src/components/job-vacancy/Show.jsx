import { useEffect, useState } from "react";
import { Form, Typography, Select, Input, Button, Checkbox, Table } from "antd";
import Api from "../../services/Api";
import BriefcaseIcon from "../../assets/svg/BriefcaseRed.svg";
import JobRequirementIcon from "../../assets/svg/JobRequirement.svg";
import JobBenefitsIcon from "../../assets/svg/JobBenefits.svg";

const { Text } = Typography;

const Show = ({ onBack, jobId }) => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);

  const columns = [
    {
      title: "Benefits Name",
      dataIndex: "benefits",
      key: "benefits",
      render: (text, record) => (
        <Input
          disabled
          defaultValue={text}
          onChange={(e) => {
            const newDataSource = [...dataSource];
            const index = newDataSource.findIndex(
              (item) => item.key === record.key
            );
            newDataSource[index].benefits = e.target.value;
            setDataSource(newDataSource);
          }}
        />
      ),
    },
  ];

  const fetchData = (jobId) => {
    Api.get(`/jobs/${jobId}`)
      .then((response) => {
        const jobDetail = response.data;
        if (jobDetail) {
          setDataSource(
            jobDetail.benefits.map((benefits, index) => ({
              key: index.toString(),
              benefits: benefits.benefit,
            }))
          );

          form.setFieldsValue({
            title: jobDetail.title,
            category: jobDetail.category,
            employment_type: jobDetail.employment_type,
            location: jobDetail.location,
            work_type: jobDetail.work_type,
            description: jobDetail.description,
            salary_type: jobDetail.salary_type,
            minimum_salary: jobDetail.minimum_salary,
            maximum_salary: jobDetail.maximum_salary,
            hide_salary: jobDetail.hide_salary,
            skills_category: jobDetail.skills_category,
            skills_requirement: jobDetail.skills_requirement.map(
              (skill) => skill.skill
            ),
            education_requirement: jobDetail.education_requirement,
            experience_requirement: jobDetail.experience_requirement,
            benefits: jobDetail.benefits.map((benefits) => benefits.benefits),
            status: jobDetail.status,
          });
        } else {
          console.error("Job detail not found in response", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching job detail data", error);
      });
  };

  useEffect(() => {
    if (jobId) {
      fetchData(jobId);
    }
  }, [jobId]);

  const handleBack = () => {
    onBack();
  };

  return (
    <div className="p-6 bg-white shadow rounded-xl p-8 ">
      <Form
        form={form}
        layout="vertical"
        size="large"
        className="w-full"
        requiredMark={false}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img src={BriefcaseIcon} alt="Job Information" className="w-12" />
            <Text className="text-xl font-semibold ml-4">Job Information</Text>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Form.Item name="title" label="Job Title">
            <Input disabled />
          </Form.Item>

          <Form.Item name="category" label="Job Category">
            <Select
              style={{ borderColor: "#BBBBBB", height: "56px" }}
              disabled
            />
          </Form.Item>

          <Form.Item
            name="employment_type"
            label="Employment Type"
            style={{ marginTop: "-16px" }}
          >
            <Select
              style={{ borderColor: "#BBBBBB", height: "56px" }}
              disabled
            />
          </Form.Item>

          <Form.Item
            name="location"
            label="Location"
            style={{ marginTop: "-16px" }}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="work_type"
            label="Work Type"
            style={{ marginTop: "-16px" }}
          >
            <Select
              style={{ borderColor: "#BBBBBB", height: "56px" }}
              disabled
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Job Description"
            style={{ width: "100%", marginTop: "-16px" }}
          >
            <Input.TextArea
              style={{ borderColor: "#BBBBBB", height: "96px" }}
              disabled
            />
          </Form.Item>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <img src={BriefcaseIcon} alt="Salary" className="w-12" />
            <Text className="text-xl font-semibold ml-4">Salary</Text>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <Form.Item name="salary_type" label="Salary Based">
            <Select
              style={{ borderColor: "#BBBBBB", height: "56px" }}
              disabled
            />
          </Form.Item>


          <div
            className="grid grid-cols-2 gap-2 w-full"
            style={{ gridColumn: "span 1" }}
          >
            <Form.Item
              name="minimum_salary"
              label="Minimum Salary"
              style={{ width: "100%" }}
            >
              <Input
                type="number"
                style={{ borderColor: "#BBBBBB", height: "56px" }}
                disabled
              />
            </Form.Item>


            <Form.Item
              name="maximum_salary"
              label="Maximum Salary"
              style={{ width: "100%" }}
            >
              <Input type="number" disabled />
            </Form.Item>
          </div>
        </div>


        <div className="flex justify-end -mt-6">
          <Form.Item name="hide_salary" valuePropName="checked" noStyle>
            <Checkbox  className="custom-checkbox" disabled>Hide Salary</Checkbox>
          </Form.Item>
        </div>


        <div className="mt-6">
          <div className="flex items-center mb-4">
            <img
              src={JobRequirementIcon}
              alt="Job Requirement"
              className="w-12"
            />
            <Text className="text-xl font-semibold ml-4">Skills</Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Form.Item name="skills_category" label="Skills Category">
              <Input
                style={{ borderColor: "#BBBBBB", height: "56px" }}
                disabled
              />
            </Form.Item>


            <Form.Item name="skills_requirement" label="Skills">
              <Select
                mode="multiple"
                style={{ borderColor: "#BBBBBB", height: "56px" }}
                disabled
              />
            </Form.Item>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center mb-4">
            <img src={JobRequirementIcon} alt="Job Requirement" className="w-12" />
            <Text className="text-xl font-semibold ml-4">Job Requirement</Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Form.Item name="education_requirement" label="Education Level">
              <Select
                style={{ borderColor: "#BBBBBB", height: "56px" }}
                disabled
              />
            </Form.Item>


            <Form.Item name="experience_requirement" label="Experience Level">
              <Select
                style={{ borderColor: "#BBBBBB", height: "56px" }}
                disabled
              />
            </Form.Item>
          </div>
        </div>

        <div className="mt-6">
        <div className="flex items-center mb-4">
          <img src={JobBenefitsIcon} alt="Job Benefits" className="w-12" />
          <Text className="text-xl font-semibold ml-4">Job Benefits</Text>
        </div>

        <Table
          className="mt-4 max-w-full custom-table"
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          footer={() => <></>}
        />
        </div>

        <div className="flex justify-end mt-6">
          <Button
          type="primary"
            onClick={handleBack}
            style={{
              marginRight: 8,
              width: "120px",
              height: "40px",
              borderRadius: "12px",
              borderColor: "#BBBBBB",
              borderWidth: "1px",
            }}
          >
            <span className="text-sm font-medium"> Back </span>
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Show;