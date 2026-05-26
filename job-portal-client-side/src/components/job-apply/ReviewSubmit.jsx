import {
  Button,
  Form,
  Input,
  Divider,
  Collapse,
  message,
  Card,
  Spin,
  Upload,
  Typography,
} from "antd";
import {
  ArrowLeftIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { 
  FilePdfOutlined, 
  FileWordOutlined, 
  FileTextOutlined, 
  FileImageOutlined, 
  FileOutlined 
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import Api from "../../services/Api";
import { useJobApply } from "../../pages/job-apply/JobApplyContext";
import { useNavigate } from "react-router-dom";
import { useOnMountUnsafe } from "../../hooks/useMountUnsave";
import { dateToMonthYear, getUserSession, previewImageUrl } from "../../utils";
import PersonalInformation from "./PersonalInformation";
import brokenIcon from "../../assets/images/broken.jpg";
import { useProfile } from "../../hooks/useProfile";

const { Panel } = Collapse;
const { Text } = Typography;

const ReviewSubmit = ({ onPrevious, jobId, onSuccess }) => {
  const [openPersonalInformation, setOpenPersonalInformation] = useState(false);
  const [loading, setLoading] = useState(true);
  const { formData } = useJobApply();
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (formData.upload_resume) {
      setFileList([
        {
          uid: formData.upload_resume.uid, // Unique identifier
          name: formData.upload_resume.name, // File name
          status: "done", // File status
          url: URL.createObjectURL(formData.upload_resume), // Temporary URL for preview
        },
      ]);
    } else {
      setFileList([]);
    }
  }, [formData.upload_resume]);

  const getFileIcon = (fileName) => {
    if (!fileName) return <FileOutlined style={{ fontSize: '32px' }} />;
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === "pdf") return <FilePdfOutlined style={{ fontSize: '32px', color: '#ff4d4f' }} />;
    if (ext === "doc" || ext === "docx") return <FileWordOutlined style={{ fontSize: '32px', color: '#1677ff' }} />;
    if (ext === "txt" || ext === "rtf") return <FileTextOutlined style={{ fontSize: '32px', color: '#8c8c8c' }} />;
    if (["png", "jpg", "jpeg"].includes(ext)) return <FileImageOutlined style={{ fontSize: '32px', color: '#52c41a' }} />;
    return <FileOutlined style={{ fontSize: '32px' }} />;
  };

  const props = {
    name: "file",
    multiple: false,
    showUploadList: false,
    fileList,
  };

  const [personalInfo, setPersonalInfo] = useState();
  const imageUrl = previewImageUrl({
    patch: "LOGO",
    url_image: personalInfo?.profile?.profile_picture_url,
  });
  const getUserInfo = async () => {
    try {
      const user = await getUserSession();
      let profile = {};
      if (user.role === "job_seeker") {
        const { data } = await Api.get("/profile/job-seeker/personal-info");
        profile = data;
      }
      setPersonalInfo({ user, profile });
      setLoading(false);
    } catch (error) {
      message.error(error);
    }
  };

  const onSubmit = async (values) => {
    try {
      await Api.put("/profile/job-seeker/personal-info", values);
      getUserInfo();
    } catch (error) {
      //console.log("updatePersonalInfo :", error);
    }
  };

  const onUploadImage = async (options) => {
    const { file } = options;
    try {
      const formData = new FormData();
      formData.append("profile_picture", file);

      await Api.post("/profile/job-seeker/profile-picture", formData, {
        headers: { "content-type": "multipart/form-data" },
      });
      getUserInfo();
    } catch (error) {
      console.log("uploadImageProfile :", error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  /**
   * @method useOnMountUnsafe
   * @description this hook handle useEffect called twice
   */
  useOnMountUnsafe(getUserInfo);

  useEffect(() => {
    if (formData?.upload_resume == null) {
      navigate("?step=choose-document", { replace: true });
    } else if (
      formData?.expected_salary == null ||
      formData?.experience_years == null
    ) {
      navigate("?step=employee-question", { replace: true });
    }
  }, []);

  const { sectionEnums, sectionItems, getAllSectionData } = useProfile({});

  const sections = {
    [sectionEnums.PERSONAL_SUMMARY]: {
      title: "Personal Summary",
      description: "Description Personal Summary",
    },
    [sectionEnums.EDUCATION]: {
      title: "Education",
      description: "Description Education",
    },
    [sectionEnums.EXPERIENCE]: {
      title: "Experience",
      description: "Description Experience",
    },
    [sectionEnums.SKILL]: {
      title: "Skills",
      description: "Description Skills",
    },
    [sectionEnums.PROJECT]: {
      title: "Projects",
      description: "Description Projects",
    },
    [sectionEnums.CERTIFICATION]: {
      title: "Certifications and Licences",
      description: "Description Certification and Licenses",
    },
    [sectionEnums.LANGUAGE]: {
      title: "Languages",
      description: "Description Languages",
    },
  };

  useOnMountUnsafe(getAllSectionData);

  const onApply = async () => {
    try {
      setLoading(true);
      console.log("formData", formData);
      await Api.post(`/apply-jobs/${jobId}`, formData, {
        headers: { "content-type": "multipart/form-data" },
      })
        .then(() => {
          message.destroy();
          message.success("Apply jobs successfully!");
          onSuccess();
        })
        .catch((error) => {
          message.destroy();
          message.error(
            error.data?.message || "Apply jobs failed. Please try again."
          );
        });
    } catch (error) {
      message.error("Apply jobs failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <div>
      <Card
        className="jobportal-section mb-8"
        style={{
          width: "43%",
        }}
      >
        <Card.Meta
          description={
            <div className="flex justify-between items-center">
              <img
                src={imageUrl || brokenIcon}
                alt="Profile"
                className="w-[110px] h-[110px] rounded-full mr-5 ml-1 border border-[#BBBBBB] p-2"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = brokenIcon;
                }}
              />

              <div className="w-4/5" style={{ fontSize: "0.8rem" }}>
                <h1 className="text-xl text-[#232323] font-medium">
                  {personalInfo?.profile?.full_name}
                </h1>
                <p className="text-xs text-[#232323] font-medium">
                  {personalInfo?.user?.email}
                </p>
                <p className="text-xs text-[#232323] font-medium">
                  {personalInfo?.profile?.phone_number}
                </p>
                <br />
                <p className="text-[#232323]">
                  {personalInfo?.profile?.address}
                </p>
              </div>

              <div className="w-1/5 text-right">
                <Button
                  type="text"
                  onClick={() => setOpenPersonalInformation(true)}
                  icon={<PencilSquareIcon className="size-5" />}
                />
              </div>
            </div>
          }
        />
      </Card>
      <Collapse
        bordered={false}
        expandIconPosition="right"
        style={{ marginBottom: 20, background: "#fff" }}
      >
        <Panel header={<Text className="text-lg">Review Resume</Text>}>
          <div
            style={{
              width: "43%",
            }}
          >
            {formData.upload_resume && (
              <div className="p-4 border border-dashed border-[#E0E0E0] rounded-2xl flex items-center justify-between bg-[#F9F9F9]">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2 rounded-xl shadow-sm border border-[#EEEEEE]">
                    {getFileIcon(formData.upload_resume.name)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-[#232323] truncate max-w-[200px]">
                      {formData.upload_resume.name}
                    </span>
                    <span className="text-[10px] text-[#9A9A9A] font-medium uppercase tracking-wider">
                      {(formData.upload_resume.size / 1024).toFixed(0)} KB
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Panel>
      </Collapse>
      <Divider />

      <Collapse
        bordered={false}
        expandIconPosition="right"
        style={{ marginBottom: 20, background: "#fff" }}
      >
        <Panel
          header={
            <>
              <Text className="text-lg">Employee Question</Text>
              <p className="text-gray-400 mt-2 text-sm font-normal">
                You answer 2 of 2 Question
              </p>
            </>
          }
        >
          <Form layout="vertical">
            <Form.Item
              name="salary"
              label="What's your expected monthly basic salary?"
            >
              <Input
                disabled
                value={formData.expected_salary}
                defaultValue={formData.expected_salary}
                prefix="Rp"
                style={{
                  width: "43%",
                  height: 56,
                  borderRadius: 12,
                  borderColor: "#BBB",
                }}
              />
            </Form.Item>
            <Form.Item
              name="experience_years"
              label="How many years of experience do you have working on this field?"
            >
              <Input
                suffix="Year"
                disabled
                style={{
                  width: "43%",
                  height: 56,
                  borderRadius: 12,
                  borderColor: "#BBB",
                }}
                defaultValue={formData?.experience_years}
              />
            </Form.Item>
          </Form>
        </Panel>
      </Collapse>
      <Divider />

      <div className="ml-4">
        <Text className="font-medium text-lg"> Profile </Text>
        <p className="text-[#9A9A9A] mb-8 text-sm">
          {" "}
          When you apply to Company X, your profile data and credentials will be
          reviewed and verified by Company X as part of the job application
          process
        </p>
      </div>
      <Collapse
        bordered={false}
        expandIconPosition="right"
        style={{ marginBottom: 20, background: "#fff" }}
        defaultActiveKey={1}
      >
        <Panel header="Education" key={1}>
          {(() => {
            const props = {
              ...sectionItems[sectionEnums["EDUCATION"]],
              ...sections[sectionEnums["EDUCATION"]],
              sectionId: "EDUCATION",
            };
            return <Section key="EDUCATION" {...props} />;
          })()}
        </Panel>
      </Collapse>
      <Divider />

      <Collapse
        bordered={false}
        expandIconPosition="right"
        style={{ marginBottom: 20, background: "#fff" }}
        defaultActiveKey={1}
      >
        <Panel header="Experience" key={1}>
          {(() => {
            const props = {
              ...sectionItems[sectionEnums["EXPERIENCE"]],
              ...sections[sectionEnums["EXPERIENCE"]],
              sectionId: "EXPERIENCE",
            };
            return <Section key="EXPERIENCE" {...props} />;
          })()}
        </Panel>
      </Collapse>
      <Divider />

      <Collapse
        bordered={false}
        expandIconPosition="right"
        style={{ marginBottom: 20, background: "#fff" }}
        defaultActiveKey={1}
      >
        <Panel
          header="Skill"
          headerStyle={{ fontSize: "15px", fontWeight: "500" }}
          key={1}
        >
          {(() => {
            const props = {
              ...sectionItems[sectionEnums["SKILL"]],
              ...sections[sectionEnums["SKILL"]],
              sectionId: "SKILL",
            };
            return <Section key="SKILL" {...props} />;
          })()}
        </Panel>
      </Collapse>
      <Divider />

      <Collapse
        bordered={false}
        expandIconPosition="right"
        style={{ marginBottom: 20, background: "#fff" }}
        defaultActiveKey={1}
      >
        <Panel header="Project" key={1}>
          {(() => {
            const props = {
              ...sectionItems[sectionEnums["PROJECT"]],
              ...sections[sectionEnums["PROJECT"]],
              sectionId: "PROJECT",
            };
            return <Section key="PROJECT" {...props} />;
          })()}
        </Panel>
      </Collapse>
      <Divider />

      <Collapse
        bordered={false}
        expandIconPosition="right"
        style={{ marginBottom: 20, background: "#fff" }}
        defaultActiveKey={1}
      >
        <Panel header="Certifications and Licenses" key={1}>
          {(() => {
            const props = {
              ...sectionItems[sectionEnums["CERTIFICATION"]],
              ...sections[sectionEnums["CERTIFICATION"]],
              sectionId: "CERTIFICATION",
            };
            return <Section key="CERTIFICATION" {...props} />;
          })()}
        </Panel>
      </Collapse>
      <Divider />
      <Collapse
        bordered={false}
        expandIconPosition="right"
        style={{ marginBottom: 20, background: "#fff" }}
        defaultActiveKey={1}
      >
        <Panel header="Languages" key={1}>
          {(() => {
            const props = {
              ...sectionItems[sectionEnums["LANGUAGE"]],
              ...sections[sectionEnums["LANGUAGE"]],
              sectionId: "LANGUAGE",
            };
            return <Section key="LANGUAGE" {...props} />;
          })()}
        </Panel>
      </Collapse>
      <Divider />

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
          <span className="font-medium text-sm">Back </span>
        </Button>
        <Button
          type="primary"
          style={{
            width: 140,
            height: 40,
            borderRadius: 10,
          }}
          loading={loading}
          onClick={onApply}
        >
          <span className="font-medium text-sm">Apply</span>
          <PaperAirplaneIcon className="size-4" />
        </Button>
        <PersonalInformation
          onSubmit={onSubmit}
          onUploadImage={onUploadImage}
          open={openPersonalInformation}
          setOpen={setOpenPersonalInformation}
          initialValues={{
            ...personalInfo.user,
            ...personalInfo.profile,
            imageUrl,
          }}
        />
      </div>
    </div>
  );
};

const Section = (props) => {
  !!props?.list?.length;
  const isContent = props?.text || !!props?.list?.length;
  return (
    <div className="w-full">
      <div className="text-[20px] font-medium flex justify-between"></div>
      {isContent &&
        (props.type == "array" ? (
          props.list.map((item, idx) => (
            <ListItemCard
              key={props.sectionId + idx}
              onDestroy={props.onDestroy}
              onButtonClick={props.onButtonClick}
              {...{
                ...item,
                sectionId: props.sectionId,
                componentId: props.sectionId + idx,
              }}
            />
          ))
        ) : (
          <TextCard onButtonClick={props.onButtonClick} {...props} />
        ))}
      {!isContent && (
        <Button
          type="primary"
          style={{
            width: 240,
            height: 40,
            backgroundColor: "#E3FCEC",
            color: "#06A73B",
            borderRadius: 12,
            fontSize: "14px",
          }}
          onClick={() => props.onButtonClick({ sectionId: props.sectionId })}
        >
          Add {props.title}
        </Button>
      )}
    </div>
  );
};

const TextCard = (props) => (
  <Card className="jobportal-section">
    <Card.Meta
      description={
        <div className="flex justify-between text-black">
          {typeof props.text === "string" ? (
            <p>{props.text}</p>
          ) : (
            <div className="w-full" style={{ fontSize: "0.8rem" }}>
              <p className="text-xl font-medium leading-7">
                {props.text?.grade}
              </p>
              <p className="text-sm">
                {props.text?.university_name} • {props.text?.major}
              </p>
              <p className="text-xs">{props.text?.degree}</p>
              <br />
              <p className="text-[10px]">
                {dateToMonthYear(props.text?.start_date)} -{" "}
                {dateToMonthYear(props.text?.end_date)}
              </p>
            </div>
          )}
        </div>
      }
    />
  </Card>
);

const ListItemCard = (props) => {
  const { sectionId, componentId, ...item } = props;
  return (
    <Card key={componentId} className="jobportal-section my-1">
      <Card.Meta
        description={
          sectionId !== "SKILL" && sectionId !== "LANGUAGE" ? (
            <div className="flex justify-between text-black">
              <div className="w-4/5">
                <p className="text-xl font-medium leading-7">
                  {item?.experience_title ||
                    item?.project_name ||
                    item?.certification_name}
                </p>
                {sectionId === "EXPERIENCE" && (
                  <p className="text-sm">
                    {item?.company_name} • {item.employment_type}
                  </p>
                )}
                <p className="text-xs">
                  {item?.location && item?.location + " -"}{" "}
                  {item?.location_type}
                </p>
                <p className="text-sm">{item?.issuing_organization}</p>
                <p className="text-xs font-normal">
                  {dateToMonthYear(item?.start_date || item?.issue_date)} -
                  {sectionId === "EXPERIENCE" &&
                    item?.start_date === item?.end_date
                    ? "Now"
                    : dateToMonthYear(item?.end_date || item?.expiration_date)}
                </p>
                <p className="mt-2 text-[13px]">
                  {item?.description || item?.credential_url}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center text-black">
              <div className="w-full">
                <p className="text-[14px] leading-5">
                  {item?.skill_name || item?.language_name}
                </p>
              </div>
            </div>
          )
        }
      />
    </Card>
  );
};

export default ReviewSubmit;
