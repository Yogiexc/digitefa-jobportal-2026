import { useState } from "react";
import { Button, Card, List, Progress } from "antd";
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
  DocumentArrowUpIcon
} from "@heroicons/react/24/outline";
import { message, Upload } from "antd";
import { useProfile } from "../../../hooks/useProfile";
import { useOnMountUnsafe } from "../../../hooks/useMountUnsave.jsx";
import { toPascalCase, dateToMonthYear } from "../../../utils";
import Api from "../../../services/Api";

const Profiles = () => {
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
    setInitialValues,
    getAllSectionData,
    action,
  } = useProfile({ defaultPercentage: 30 });

  const [popup, setPopUp] = useState(defaultPopUp);
  const [linkAccountOpen, setLinkAccountOpen] = useState(false);

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
    try {
      const formData = new FormData();
      formData.append("file", file);
      message.loading({ content: 'Parsing CV with AI...', key: 'cvupload' });
      await Api.post("/profile/cv-autofill", formData, {
        headers: { "content-type": "multipart/form-data" },
      });
      message.success({ content: 'Profile successfully updated from CV!', key: 'cvupload' });
      onSuccess();
      // Reload the data gracefully instead of full page reload if possible
      getAllSectionData();
    } catch (error) {
      console.error(error);
      message.error({ content: 'Failed to process CV', key: 'cvupload' });
      onError(error);
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
              <Upload
                accept=".pdf"
                customRequest={onCvUpload}
                showUploadList={false}
              >
                <Button
                  icon={<SparklesIcon className="w-5 h-5 text-purple-600" />}
                  className="mb-8 w-full border-purple-300 bg-purple-50 hover:bg-purple-100 flex items-center justify-center h-12 rounded-xl shadow-sm"
                >
                  <span className="text-purple-700 font-semibold text-sm">Autofill from CV</span>
                </Button>
              </Upload>
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

      <LinkAccount open={linkAccountOpen} setOpen={setLinkAccountOpen} />

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