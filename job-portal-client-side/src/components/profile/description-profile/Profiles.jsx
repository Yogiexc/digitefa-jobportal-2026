import { useState } from "react";
import { Button, Card, List, Progress, Modal, Typography, Divider } from "antd";
import PersonalSummary from "./PersonalSummary";
import Education from "./Education";
import Experience from "./Experience";
import Skills from "./Skills";
import Projects from "./Projects";
import CertificationsLicenses from "./CertificationsLicenses";
import Languages from "./Languages";
import LinkAccount from "./LinkAccount";
import WebChart from "./WebChart";
import {
  CheckCircleIcon,
  XCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  LinkIcon,
  SparklesIcon,
  DocumentArrowUpIcon,
  ArrowDownTrayIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import { message, Upload } from "antd";
import { useProfile } from "../../../hooks/useProfile";
import { useOnMountUnsafe } from "../../../hooks/useMountUnsave.jsx";
import { toPascalCase, dateToMonthYear } from "../../../utils";
import Api from "../../../services/Api";

const Profiles = ({ onAutofillSuccess }) => {
  const [profileCompletion, setProfileCompletion] = useState({
    percentage: 30,
    show: false,
    default: {
      setupAccount: { title: "Setup Account" },
      personalInformation: { title: "Personal Information" },
    },
  });

  const {
    sectionEnums,
    defaultPopUp,
    initialValues,
    sectionItems,
    contextHolder,
    percentage,
    messageApi,
    setInitialValues,
    getAllSectionData,
    action,
  } = useProfile({ defaultPercentage: 30 });

  const { Title, Text } = Typography;
  const [cvPreviewVisible, setCvPreviewVisible] = useState(false);
  const [parsedCvData, setParsedCvData] = useState(null);
  const [isConfirmingCv, setIsConfirmingCv] = useState(false);

  const [popup, setPopUp] = useState(defaultPopUp);
  const [isAutofilling, setIsAutofilling] = useState(false);
  const [linkAccountOpen, setLinkAccountOpen] = useState(false);
  const [isAutofillModalOpen, setIsAutofillModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [emptyFields, setEmptyFields] = useState([]);

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
    ACCOUNT_INTEGRATION: {
      title: "Account Integration",
      description: "Connect your Job Portal account with the LMS system for integrated features",
    },
  };

  const onHandlePopUp = (key, value) => {
    setPopUp(() => ({ ...defaultPopUp, [sectionEnums[key]]: value }));
  };

  const handleButtonClick = ({ sectionId, data }) => {
    setInitialValues(data);
    onHandlePopUp(sectionId, true);
  };

  const onDestroy = async ({ sectionId, data }) => {
    let payload = {};
    if ("education_id" in data)
      payload = {
        primaryKey: "education_id",
        values: { education_id: data.education_id },
      };
    if ("experience_id" in data)
      payload = {
        primaryKey: "experience_id",
        values: { experience_id: data.experience_id },
      };
    if ("skill_id" in data)
      payload = { primaryKey: "skill_id", values: { skill_id: data.skill_id } };
    if ("project_id" in data)
      payload = {
        primaryKey: "project_id",
        values: { project_id: data.project_id },
      };
    if ("certification_id" in data)
      payload = {
        primaryKey: "certification_id",
        values: { certification_id: data.certification_id },
      };
    if ("language_id" in data)
      payload = {
        primaryKey: "language_id",
        values: { language_id: data.language_id },
      };

    await action(sectionEnums[sectionId], "delete", payload);
  };

  const onShowDetail = () => {
    setProfileCompletion((prev) => ({
      ...prev,
      show: !profileCompletion.show,
    }));
  };

  const onCvUpload = async (options) => {
    const { file, onSuccess, onError } = options;
    setIsAutofilling(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      messageApi.loading({ content: 'Uploading and extracting CV via AI...', key: 'cvupload' });
      const response = await Api.post("/profile/cv-autofill", formData, {
        headers: { "content-type": "multipart/form-data" },
      });
      messageApi.success({ content: 'Profile successfully updated from CV!', key: 'cvupload' });
      
      // Check for unread sections from the backend response
      // We check multiple paths to be sure we catch it regardless of wrapper structure
      const unreadSections = 
        response.data?.data?.unread_sections || 
        response.data?.unread_sections || 
        response.data?.parsed_data?.unread_sections;
      
      if (unreadSections && Array.isArray(unreadSections) && unreadSections.length > 0) {
        setEmptyFields(unreadSections);
        setIsErrorModalOpen(true);
      }

      // Refresh section data
      await getAllSectionData();
      
      // Refresh banner data
      if (onAutofillSuccess) {
        await onAutofillSuccess();
      }
      
      // Close modal on success
      setIsAutofillModalOpen(false);
      onSuccess();
    } catch (error) {
      console.error(error);
      messageApi.error({ content: 'Failed to process CV', key: 'cvupload' });
      onError(error);
    } finally {
      setIsAutofilling(false);
    }
  };

  useOnMountUnsafe(getAllSectionData);

  return (
    <div className="bg-white min-h-screen px-4 md:px-[110px] py-6 md:py-10">
      {contextHolder}
      <div className="flex flex-col md:flex-row md:justify-between w-full">
        <div className="space-y-8 md:space-y-[40px] w-full">
          <Section
            title={sections.ACCOUNT_INTEGRATION.title}
            description={sections.ACCOUNT_INTEGRATION.description}
            type="modal"
            onButtonClick={() => setLinkAccountOpen(true)}
            buttonText="Link Account"
            icon={<LinkIcon className="h-4 w-4 mr-1" />}
          />

          {Object.keys(sectionEnums).map((key) => {
            const props = {
              ...sectionItems[sectionEnums[key]],
              ...sections[sectionEnums[key]],
              sectionId: key,
            };
            return (
              <Section
                key={key}
                onButtonClick={handleButtonClick}
                onDestroy={onDestroy}
                {...props}
              />
            );
          })}
        </div>
        <div className="mt-8 md:mt-0 md:ml-20">
          <Card className="shadow-lg rounded-[20px] md:rounded-[40px] md:ml-48 w-full md:w-[276px]">
            <div className="flex flex-col items-center h-full justify-center p-4">
              <div className="text-base font-semibold mb-6 md:mb-8">
                Profile Completion
              </div>
              <Button
                icon={<SparklesIcon className="w-5 h-5 text-purple-600" />}
                className="mb-8 w-full border-purple-300 bg-purple-50 hover:bg-purple-100 flex items-center justify-center h-12 rounded-xl shadow-sm"
                onClick={() => setIsAutofillModalOpen(true)}
              >
                <span className="text-purple-700 font-semibold text-sm">Autofill from CV</span>
              </Button>
              <Progress
                type="circle"
                percent={percentage}
                width={120}
                format={(percentage) => `${percentage} %`}
                strokeColor="#09502A"
                strokeWidth="12"
              />
              <Button
                className="mt-6 md:mt-8 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                onClick={() => onShowDetail()}
                type="primary"
                size="sm"
              >
                Detail
              </Button>
            </div>
            {profileCompletion.show && (
              <List itemLayout="horizontal" className="px-4">
                {Object.keys({
                  ...profileCompletion.default,
                  ...sectionEnums,
                }).map((key) => {
                  let renderIcon = (
                    <CheckCircleIcon className="size-5 text-[#06A73B]" />
                  );
                  const item = sectionItems[sectionEnums[key]];

                  if (
                    item &&
                    !["setupAccount", "personalInformation"].includes(key)
                  ) {
                    if (
                      ("text" in item && !item.text) ||
                      (item.type === "array" && item.list.length === 0)
                    ) {
                      renderIcon = (
                        <XCircleIcon className="size-5 text-[#FF3526]" />
                      );
                    }
                  }
                  return (
                    <List.Item key={key}>
                      <List.Item.Meta
                        avatar={renderIcon}
                        title={
                          <p>
                            {profileCompletion.default[key]?.title ||
                              sections[sectionEnums[key]]?.title}
                          </p>
                        }
                      />
                    </List.Item>
                  );
                })}
              </List>
            )}
            <WebChart sectionItems={sectionItems} />
          </Card>
        </div>
      </div>



      <LinkAccount
        open={linkAccountOpen}
        setOpen={setLinkAccountOpen}
        onSuccess={getAllSectionData}
      />

      <PersonalSummary
        action={action}
        section={sectionEnums.PERSONAL_SUMMARY}
        open={popup[sectionEnums.PERSONAL_SUMMARY]}
        setOpen={onHandlePopUp}
        initialValues={initialValues}
        resetForm={setInitialValues}
      />
      <Education
        action={action}
        section={sectionEnums.EDUCATION}
        open={popup[sectionEnums.EDUCATION]}
        setOpen={onHandlePopUp}
        initialValues={initialValues}
        resetForm={setInitialValues}
      />
      <Experience
        action={action}
        section={sectionEnums.EXPERIENCE}
        open={popup[sectionEnums.EXPERIENCE]}
        setOpen={onHandlePopUp}
        initialValues={initialValues}
        resetForm={setInitialValues}
      />
      <Skills
        action={action}
        section={sectionEnums.SKILL}
        open={popup[sectionEnums.SKILL]}
        setOpen={onHandlePopUp}
      />
      <Projects
        action={action}
        section={sectionEnums.PROJECT}
        open={popup[sectionEnums.PROJECT]}
        setOpen={onHandlePopUp}
        initialValues={initialValues}
        resetForm={setInitialValues}
      />
      <CertificationsLicenses
        action={action}
        section={sectionEnums.CERTIFICATION}
        open={popup[sectionEnums.CERTIFICATION]}
        setOpen={onHandlePopUp}
        initialValues={initialValues}
        resetForm={setInitialValues}
      />
      <Languages
        action={action}
        section={sectionEnums.LANGUAGE}
        open={popup[sectionEnums.LANGUAGE]}
        setOpen={onHandlePopUp}
      />

      <Modal
        title={
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-purple-600" />
            <span>Autofill Profile from CV</span>
          </div>
        }
        open={isAutofillModalOpen}
        onCancel={() => setIsAutofillModalOpen(false)}
        footer={null}
        centered
        width={400}
        styles={{ body: { padding: '24px 20px' } }}
      >
        <div className="flex flex-col gap-4">
          <p className="text-gray-500 text-sm mb-2">
            Choose an option to automatically populate your profile information using our AI extraction tool.
          </p>

          <a href="/template/Digitefa CV Template.docx" download>
            <Button
              type="default"
              size="large"
              block
              className="h-16 flex items-center justify-between px-10 rounded-2xl bg-[#E3FCEC] hover:bg-[#E3FCEC]"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#06A73B]/10 rounded-xl group-hover:bg-white/20 transition-colors">
                  <ArrowDownTrayIcon className="w-5 h-5 text-[#06A73B] group-hover:text-[#E3FCEC]" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm text-[#06A73B] group-hover:text-[#E3FCEC]">Download Template</div>
                  <div className="text-[11px] font-medium text-[#06A73B]/70 group-hover:text-[#E3FCEC]/80">Use our standard format</div>
                </div>
              </div>
            </Button>
          </a>

          <div className="flex items-center gap-2 my-1">
            <div className="flex-1 h-[1px] bg-gray-100"></div>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider text-center px-2">
              if you already have your own CV you can directly upload it
            </p>
            <div className="flex-1 h-[1px] bg-gray-100"></div>
          </div>

          <Upload
            accept=".pdf"
            customRequest={onCvUpload}
            showUploadList={false}
            className="w-full"
          >
            <Button
              type="primary"
              size="large"
              block
              loading={isAutofilling}
              className="h-16 flex items-center justify-between px-14 rounded-2xl bg-purple-100 hover:bg-purple-700"
            >
              <div className="flex items-center gap-3 text-white">
                <div className="p-2 bg-purple-500/30 rounded-xl group-hover:bg-purple-500/50 transition-colors">
                  <DocumentArrowUpIcon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-purple-500 text-sm">Upload & Autofill</div>
                  <div className="text-[11px] text-purple-500 font-medium">Extract data from your CV</div>
                </div>
              </div>
            </Button>
          </Upload>
        </div>
      </Modal>
      
      <Modal
        title={
          <div className="flex items-center gap-2 text-red-600">
            <ExclamationTriangleIcon className="w-6 h-6" />
            <span className="font-bold">Incomplete Profile Information</span>
          </div>
        }
        open={isErrorModalOpen}
        onCancel={() => setIsErrorModalOpen(false)}
        footer={[
          <Button 
            key="close" 
            type="primary" 
            danger
            onClick={() => setIsErrorModalOpen(false)}
            className="rounded-lg px-6"
          >
            I'll fix it manually
          </Button>
        ]}
        centered
        width={450}
        styles={{ body: { padding: '24px' } }}
      >
        <div className="flex flex-col gap-4">
          <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
            <p className="text-red-800 text-sm font-medium mb-3">
              We successfully processed your CV, but some sections could not be extracted or are still empty:
            </p>
            <ul className="grid grid-cols-1 gap-2">
              {emptyFields.map((field, index) => (
                <li key={index} className="flex items-center gap-2 text-red-700 text-sm">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                  {field}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-gray-500 text-xs italic">
            Tip: Make sure your CV follows a standard format for better extraction results. You can download our template for the best experience.
          </p>
        </div>
      </Modal>
    </div>
  );
};

const Section = (props) => {
  const isListButton = props.type === "array" && !!props?.list?.length;
  const isContent = props?.text || !!props?.list?.length;
  const isModalType = props.type === "modal";

  return (
    <div className="w-full mb-[60px]">
      <div className="text-[20px] font-medium flex justify-between">
        {props.title}
        {isListButton && !isModalType && (
          <Button
            className="bg-[#E3FCEC] text-[#06A73B]"
            type="primary"
            style={{
              borderRadius: 8,
              fontSize: "0.75rem",
            }}
            onClick={() => props.onButtonClick({ sectionId: props.sectionId })}
          >
            Add {toPascalCase(props.sectionId)}
          </Button>
        )}
      </div>
      <div className="text-[14px] text-gray-500 mb-2">{props.description}</div>

      {isModalType && props.buttonText && (
        <Button
          className="bg-[#1890ff] text-white hover:bg-[#40a9ff]"
          type="primary"
          style={{
            borderRadius: 8,
            fontSize: "0.75rem",
            display: "flex",
            alignItems: "center",
          }}
          icon={props.icon}
          onClick={props.onButtonClick}
        >
          {props.buttonText}
        </Button>
      )}

      {isContent && !isModalType &&
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

      {!isContent && !isModalType && (
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
  <Card className="jobportal-section w-full">
    <Card.Meta
      description={
        <div className="flex justify-between text-black">
          {typeof props.text === "string" ? (
            <p>{props.text}</p>
          ) : (
            <div className="w-4/5" style={{ fontSize: "0.8rem" }}>

              <p className="text-xl font-medium leading-7">
                {props.text?.university_name}
              </p>
              <p className="text-[15px]">
                {props.text?.major}
              </p>
              <p className="text-xs">{props.text?.degree}</p>
              <p className="text-xs">
                GPA :{props.text?.grade}
              </p>
              <p className="text-[10px]">
                {dateToMonthYear(props.text?.start_date)} -{" "}
                {dateToMonthYear(props.text?.end_date)}
              </p>
            </div>
          )}
          <div className="w-1/5 text-right flex justify-end space-x-2">
            <Button
              type="text"
              onClick={() =>
                props.onButtonClick({
                  sectionId: props.sectionId,
                  data:
                    typeof props.text === "string"
                      ? { personal_summary: props.text }
                      : props.text,
                })
              }
              icon={<PencilSquareIcon className="size-5" />}
            />
            {typeof props.text !== "string" && (
              <Button
                type="text"
                onClick={() => props.onDestroy({ sectionId: props.sectionId, data: props.text })}
                icon={<TrashIcon className="h-5 w-5" />}
              />
            )}
          </div>
        </div>
      }
    />
  </Card>
);

const ListItemCard = (props) => {
  const { sectionId, componentId, onButtonClick, onDestroy, ...item } = props;
  return (
    <Card key={componentId} className="jobportal-section my-1 w-full">
      <Card.Meta
        description={
          sectionId !== "SKILL" && sectionId !== "LANGUAGE" ? (
            <div className="flex justify-between text-black">
              <div className="flex-1">
                <p className="text-xl font-medium leading-7">
                  {item?.experience_title ||
                    item?.project_name ||
                    item?.certification_name ||
                    item?.university_name}
                </p>
                {sectionId === "EXPERIENCE" && (
                  <p className="text-sm">
                    {item?.company_name} • {item.employment_type}
                  </p>
                )}
                {sectionId === "EDUCATION" && (
                  <p className="text-sm">
                    {item?.major} • {item?.degree}
                  </p>
                )}
                <p className="text-xs">
                  {item?.location && item?.location + " -"}{" "}
                  {item?.location_type}
                </p>
                {sectionId === "EDUCATION" && (
                  <p className="text-xs">GPA: {item?.grade}</p>
                )}
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
              <div className="flex space-x-2 ml-4">
                <Button
                  type="text"
                  onClick={() => onButtonClick({ sectionId, data: item })}
                  icon={<PencilSquareIcon className="h-5 w-5" />}
                  className="ml-1"
                />
                <Button
                  type="text"
                  onClick={() => onDestroy({ sectionId, data: item })}
                  icon={<TrashIcon className="h-5 w-5" />}
                  className="mr-1"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center text-black w-full">
              <div className="flex-1">
                <p className="text-[14px] leading-5">
                  {item?.skill_name || item?.language_name}
                </p>
              </div>
              <div className="flex space-x-2 ml-4 text-right">
                <Button
                  type="text"
                  onClick={() => onDestroy({ sectionId, data: item })}
                  icon={<TrashIcon className="size-5" />}
                  className="ml-1"
                />
              </div>
            </div>
          )
        }
      />
    </Card>
  );
};

export default Profiles;