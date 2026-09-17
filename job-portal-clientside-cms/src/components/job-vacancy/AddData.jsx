import { useRef, useEffect, useState } from "react";
import { Form, Typography, Select, Input, Button, Checkbox, Table, DatePicker } from "antd";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Api from "../../services/Api";
import BriefcaseIcon from "../../assets/svg/BriefcaseRed.svg";
import SalaryIcon from "../../assets/svg/Salary.svg";
import SkillsIcon from "../../assets/svg/Skills.svg";
import JobRequirementIcon from "../../assets/svg/JobRequirement.svg";
import JobBenefitsIcon from "../../assets/svg/JobBenefits.svg";

const { Text } = Typography;

const MAX_DISPLAY_ITEMS = 3;

const AddData = ({
  setOpen,
  onBack,
  setOpenStatusModal,
  setModalMessage,
  setModalStatus,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const requiredLabel = (text) => (<span><span className="text-red-500">*</span> {text}</span>);

  const [dataSource, setDataSource] = useState([{ key: "1", benefitName: "" }]);
  const [skillsData, setSkillsData] = useState([]);
  const [skillsCategories, setSkillsCategories] = useState([]);
  const [experienceLevel, setExperienceLevel] = useState([]);
  const [isSalaryHidden, setIsSalaryHidden] = useState(false);
  const [skillsName, setSkillsName] = useState("");
  const inputRefSkills = useRef(null);
  const [selectedSkillsCategory, setSelectedSkillsCategory] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);

  const columns = [
    {
      title: "Benefits Name",
      dataIndex: "benefits",
      key: "benefits",
      render: (text, record) => (
        <Input
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
    {
      title: "Action",
      key: "action",
      width: "10%",
      render: (_, record) => (
        <Button
          type="text"
          icon={<TrashIcon className="size-5" fill="#DC362E" stroke="#fff" />}
          onClick={() => handleDelete(record.key)}
        />
      ),
    },
  ];

  const handleDelete = (key) => {
    if (key === "1") {
      return;
    }
    const newDataSource = dataSource.filter((item) => item.key !== key);
    setDataSource(newDataSource);
  };

  const handleAdd = () => {
    const newKey = dataSource.length
      ? parseInt(dataSource[dataSource.length - 1].key) + 1
      : 1;
    const newDataSource = [
      ...dataSource,
      { key: newKey.toString(), benefitName: "" },
    ];
    setDataSource(newDataSource);
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        const payload = {
          title: values.title,
          category: values.category,
          employment_type: values.employment_type,
          // position_level: values.position_level,
          location: values.location,
          work_type: values.work_type,
          expired_at: values.expired_at ? values.expired_at.toISOString() : null,
          description: values.description,
          salary_type: values.salary_type,
          ...(values.minimum_salary
            ? { minimum_salary: parseInt(values.minimum_salary, 10) }
            : { minimum_salary: 0 }),
          ...(values.maximum_salary
            ? { maximum_salary: parseInt(values.maximum_salary, 10) }
            : { maximum_salary: 0 }),
          hide_salary: values.hide_salary || false,
          skills_category: values.skills_category,
          skills_requirement: values.skills_requirement || [],
          education_requirement: values.education_requirement,
          experience_requirement: values.experience_requirement,
          benefits: dataSource.map((item) => item.benefits),
          status: "active",
        };

        Api.post(`/jobs`, payload)
          .then((res) => {
            const { message, status } = res;
            form.resetFields();
            setOpen(false);
            setModalMessage(message);
            setModalStatus(status === "success" ? "success" : "failed");
            setOpenStatusModal(true);
          })
          .catch((error) => {
            console.error("Error:", error);
            const errorData = error.response?.data?.message || [];
            const formErrors = errorData.map((err, index) => ({
              name: Object.keys(payload)[index],
              errors: [err],
            }));
            form.setFields(formErrors);
          });
      })
      .catch(() => {
        // error handling
      });
  };

  const fetchCategory = () => {
    setLoading(true);
    Api.get(`/skills-category?pageSize=100`)
      .then((response) => {
        setSkillsCategories(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchExperienceLevel = () => {
    setLoading(true);
    Api.get(`/experience-levels?pageSize=100`)
      .then((response) => {
        setExperienceLevel(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchExperienceLevel();
  }, []);

  const fetchSkills = () => {
    setLoading(true);
    Api.get(
      `/skills-category/list-skills-name/${form.getFieldValue(
        "skills_category"
      )}`
    )
      .then((response) => {
        setSkillsData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  const handleHideSalaryChange = (e) => {
    setIsSalaryHidden(e.target.checked);
    if (e.target.checked) {
      form.setFieldsValue({ minimum_salary: "", maximum_salary: "" });
    }
  };

  const addSkills = () => {
    setSkillsData([...skillsData, skillsName]);
    form.setFieldsValue({
      skills_requirement: [
        ...(form.getFieldValue("skills_requirement") || []), // Ambil nilai saat ini atau array kosong jika belum ada
        skillsName, // Nilai baru yang ingin ditambahkan
      ],
    });
    setSkillsName("");
    setTimeout(() => {
      inputRefSkills.current?.blur();
    }, 0);
  };

  const handleBack = () => {
    onBack();
  };

  return (
    <>
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
              <Text className="text-xl font-semibold ml-4">
                Job Information
              </Text>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <Form.Item
              name="title"
              label={requiredLabel("Job Title")}
              rules={[{ required: true, message: "Please enter job title" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="category"
              label={requiredLabel("Job Category")}
              rules={[
                { required: true, message: "Please select job category" },
              ]}
            >
              <Select style={{ borderColor: "#BBBBBB", height: "56px" }}>
                <Select.Option value="information_and_communication_technology">
                  Information and Communication Technology
                </Select.Option>
                <Select.Option value="public_administration_and_government">
                  Public Administration and Government
                </Select.Option>
                <Select.Option value="human_resources_and_administration">
                  Human Resources and Administration
                </Select.Option>
                <Select.Option value="healthcare_and_social_assistance">
                  Healthcare and Social Assistance
                </Select.Option>
                <Select.Option value="arts_entertainment_and_media">
                  Arts Entertainment and Media
                </Select.Option>
                <Select.Option value="transportation_and_logistics">
                  Transportation and Logistics
                </Select.Option>
                <Select.Option value="education_and_training">
                  Education and Training
                </Select.Option>
                <Select.Option value="finance_and_insurance">
                  Finance and Insurance
                  <Select.Option value="hospitality_and_tourism">
                    Hospitality and Tourism
                  </Select.Option>
                  <Select.Option value="science_and_research">
                    Science and Research
                  </Select.Option>
                </Select.Option>
                <Select.Option value="sales_and_marketing">
                  Sales and Marketing
                </Select.Option>
                <Select.Option value="manufacturing">
                  Manufacturing
                </Select.Option>
                <Select.Option value="construction">Construction</Select.Option>
                <Select.Option value="retail">Retail</Select.Option>
                <Select.Option value="legal">Legal</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="employment_type"
              label={requiredLabel("Employment Type")}
              rules={[
                { required: true, message: "Please select employment type" },
              ]}
              style={{ marginTop: "-16px" }}
            >
              <Select style={{ borderColor: "#BBBBBB", height: "56px" }}>
                <Select.Option value="full_time">Full Time</Select.Option>
                <Select.Option value="freelance">Freelance</Select.Option>
                <Select.Option value="internship">Internship</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="location"
              label={requiredLabel("Location")}
              rules={[{ required: true, message: "Please enter location" }]}
              style={{ marginTop: "-16px" }}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="work_type"
              label={requiredLabel("Work Type")}
              rules={[{ required: true, message: "Please select work type" }]}
              style={{ marginTop: "-16px" }}
            >
              <Select style={{ borderColor: "#BBBBBB", height: "56px" }}>
                <Select.Option value="on_site">On Site</Select.Option>
                <Select.Option value="remote">Remote</Select.Option>
                <Select.Option value="hybrid">Hybrid</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="expired_at"
              label={requiredLabel("Expired Date & Time")}
              rules={[{ required: true, message: "Please select expired date" }]}
              style={{ marginTop: "-16px" }}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                style={{ borderColor: "#BBBBBB", height: "56px", width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              name="description"
              label={requiredLabel("Job Description")}
              rules={[
                { required: true, message: "Please enter job description" },
              ]}
              style={{ width: "100%", marginTop: "-16px" }}
            >
              <Input.TextArea
                style={{
                  borderColor: "#BBB",
                  height: "100px",
                }}
              />
            </Form.Item>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img src={SalaryIcon} alt="Salary" className="w-12" />
                <Text className="text-xl font-semibold ml-4">Salary</Text>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <Form.Item
                name="salary_type"
                label={requiredLabel("Salary Based")}
                rules={[
                  { required: true, message: "Please select salary based" },
                ]}
              >
                <Select style={{ borderColor: "#BBBBBB", height: "56px" }}>
                  <Select.Option value="project_based">
                    Project Based
                  </Select.Option>
                  <Select.Option value="monthly_based">
                    Monthly Based
                  </Select.Option>
                </Select>
              </Form.Item>

              <div className="grid grid-cols-2 gap-2 w-full">
                <Form.Item
                  name="minimum_salary"
                  label={requiredLabel("Minimum Salary")}
                  rules={[
                    {
                      required: !isSalaryHidden,
                      message: "Please enter minimum salary",
                    },
                  ]}
                >
                  <Input
                    style={{ borderColor: "#BBB" }}
                    disabled={isSalaryHidden}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="maximum_salary"
                  label={requiredLabel("Maximum Salary")}
                  rules={[
                    {
                      required: !isSalaryHidden,
                      message: "Please enter maximum salary",
                    },
                  ]}
                >
                  <Input
                    disabled={isSalaryHidden}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    }}
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <div className="flex justify-end -mt-5">
            <Form.Item name="hide_salary" valuePropName="checked" noStyle>
              <Checkbox
                onChange={handleHideSalaryChange}
                className="custom-checkbox"
              >
                Hide Salary
              </Checkbox>
            </Form.Item>
          </div>

          <div className="mt-6">
            <div className="flex items-center mb-4">
              <img src={SkillsIcon} alt="Job Requirement" className="w-12" />
              <Text className="text-xl font-semibold ml-4">Skills</Text>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Form.Item
                name="skills_category"
                label={requiredLabel("Skills Category")}
                rules={[
                  { required: true, message: "Please select skills category" },
                ]}
              >
                <Select
                  showSearch
                  onChange={(value) => {
                    setSelectedSkillsCategory(value);
                    fetchSkills();
                  }}
                  style={{ borderColor: "#BBBBBB", height: "56px" }}
                  loading={loading}
                  options={skillsCategories.map((category) => ({
                    value: category.category_name,
                    label: category.category_name,
                  }))}
                />
              </Form.Item>

              <Form.Item
                name="skills_requirement"
                label={requiredLabel("Skills")}
                rules={[
                  {
                    required: true,
                    message: "Please select skills requirement",
                  },
                ]}
              >
                <Select
                  showSearch
                  disabled={!selectedSkillsCategory}
                  mode="multiple"
                  style={{ borderColor: "#BBBBBB", height: "56px" }}
                  maxTagCount={MAX_DISPLAY_ITEMS}
                  maxTagPlaceholder={(omittedValues) =>
                    `+${omittedValues.length} More`
                  }
                  value={selectedSkills}
                  onChange={(value) => setSelectedSkills(value)}
                  onSearch={(value) => setSkillsName(value)}
                  searchValue={skillsName}
                  notFoundContent={
                    <div>
                      {skillsName && (
                        <Button
                          type="text"
                          className="p-0 w-full"
                          icon={<PlusIcon className="size-4" />}
                          onClick={addSkills}
                        >
                          Add {skillsName}
                        </Button>
                      )}
                    </div>
                  }
                  options={skillsData.map((item) => ({
                    label: item,
                    value: item,
                  }))}
                />
              </Form.Item>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center mb-4">
              <img
                src={JobRequirementIcon}
                alt="Job Requirement"
                className="w-12"
              />
              <Text className="text-xl font-semibold ml-4">
                Job Requirement
              </Text>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Form.Item
                name="education_requirement"
                label={requiredLabel("Education Level")}
                rules={[
                  { required: true, message: "Please select education level" },
                ]}
              >
                <Select style={{ borderColor: "#BBBBBB", height: "56px" }}>
                  <Select.Option value="Associate Degree">
                    Associate Degree
                  </Select.Option>
                  <Select.Option value="Bachelor's Degree">
                    {`Bachelor's Degree`}
                  </Select.Option>
                  <Select.Option value="Master's Degree">
                    {`Master's Degree`}
                  </Select.Option>
                  <Select.Option value="Doctoral Degree">
                    Doctoral Degree
                  </Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="experience_requirement"
                label={requiredLabel("Experience Level")}
                rules={[
                  { required: true, message: "Please select experience level" },
                ]}
              >
                <Select
                  placeholder="Experience Level"
                  style={{ borderColor: "#BBBBBB", height: "56px" }}
                  loading={loading}
                  options={experienceLevel.map((experience_requirement) => ({
                    value: experience_requirement.name,
                    label: experience_requirement.name,
                  }))}
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
              className="mt-4 max-w-full custom-table custom-table-wrapper"
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              footer={() => (
                <Button
                  type="primary"
                  style={{ borderRadius: 12, height: 35, width: 95 }}
                  icon={<PlusIcon className="size-4" />}
                  onClick={handleAdd}
                >
                  <span className="text-xs font-medium"> Add Row</span>
                </Button>
              )}
            />
          </div>

          <div className="flex justify-end mt-6">
            <Button
              style={{
                marginRight: 8,
                width: "120px",
                height: "40px",
                borderRadius: "12px",
                borderColor: "#BBBBBB",
                borderWidth: "1px",
              }}
              onClick={handleBack}
            >
              <span className="text-sm font-medium"> Back </span>
            </Button>
            <Button
              type="primary"
              style={{
                width: "120px",
                height: "40px",
                borderRadius: "12px",
              }}
              onClick={handleSave}
            >
              <span className="text-sm font-medium"> Save </span>
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default AddData;
