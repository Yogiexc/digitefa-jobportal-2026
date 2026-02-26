import { Button, Card } from "antd";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useOnMountUnsafe } from "../../hooks/useMountUnsave";
import Education from "../profile/description-profile/Education";
import { useProfile } from "../../hooks/useProfile";
import { useState } from "react";
import { dateToMonthYear, toPascalCase } from "../../utils";
import PersonalSummary from "../profile/description-profile/PersonalSummary";
import Experience from "../profile/description-profile/Experience";
import Skills from "../profile/description-profile/Skills";
import Projects from "../profile/description-profile/Projects";
import Languages from "../profile/description-profile/Languages";
import CertificationsLicenses from "../profile/description-profile/CertificationsLicenses";
import { useJobApply } from "../../pages/job-apply/JobApplyContext";

const UpdateProfile = ({ onPrevious, onNext }) => {
  const { formData } = useJobApply();
  if (
    formData.upload_resume == null ||
    formData.expected_salary == null ||
    formData.experience_years == null
  ) {
    onPrevious();
  }
  const {
    sectionEnums,
    defaultPopUp,
    initialValues,
    sectionItems,
    contextHolder,
    setInitialValues,
    getAllSectionData,
    action,
  } = useProfile({});

  const [popup, setPopUp] = useState(defaultPopUp);

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

  const onHandlePopUp = (key, value) => {
    setPopUp(() => ({ ...defaultPopUp, [sectionEnums[key]]: value }));
  };

  const handleButtonClick = ({ sectionId, data }) => {
    setInitialValues(data);
    onHandlePopUp(sectionId, true);
  };

  const onDestroy = async ({ sectionId, data }) => {
    let payload = {};
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

  useOnMountUnsafe(getAllSectionData);
  const leftSections = [
    sectionEnums.EDUCATION,
    sectionEnums.EXPERIENCE,
    sectionEnums.CERTIFICATION,
  ];
  const rightSections = [
    sectionEnums.SKILL,
    sectionEnums.PROJECT,
    sectionEnums.LANGUAGE,
  ];
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
        {contextHolder}
        {/* Kolom Kiri */}
        <div className="space-y-[60px] w-full">
          {Object.keys(sectionEnums)
            .filter((key) => leftSections.includes(sectionEnums[key]))
            .map((key) => {
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

        {/* Kolom Kanan */}
        <div className="space-y-[60px] w-full">
          {Object.keys(sectionEnums)
            .filter((key) => rightSections.includes(sectionEnums[key]))
            .map((key) => {
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
          onClick={onNext}
        >
          <span className="font-medium text-sm">Continue</span>
          <ArrowRightIcon className="size-4" />
        </Button>
      </div>
    </>
  );
};

const Section = (props) => {
  const isListButton = props.type === "array" && !!props?.list?.length;
  const isContent = props?.text || !!props?.list?.length;
  return (
    <div className="w-full mb-[60px]">
      <div className="text-[20px] font-medium flex justify-between">
        {props.title}
        {isListButton && (
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
  <div className="flex">
    <Card className="jobportal-section">
      <Card.Meta
        description={
          <div className="flex justify-between text-black">
            {typeof props.text === "string" ? (
              <p>{props.text}</p>
            ) : (
              <div className="w-4/5" style={{ fontSize: "0.8rem" }}>
                <p className="text-[20px] font-medium leading-7">
                  {props.text?.grade}
                </p>
                <p>
                  {props.text?.university_name} &#9679; {props.text?.major}
                </p>
                <p className="text-xs">{props.text?.degree}</p>
                <br />
                <small>
                  {dateToMonthYear(props.text?.start_date)} -
                  {dateToMonthYear(props.text?.end_date)}
                </small>
              </div>
            )}
            <div className="w-1/5 text-right">
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
            </div>
          </div>
        }
      />
    </Card>
  </div>
);

const ListItemCard = (props) => {
  const { sectionId, componentId, onButtonClick, onDestroy, ...item } = props;
  return (
    <div className="flex">
      <Card key={componentId} className="jobportal-section my-1">
        <Card.Meta
          description={
            sectionId !== "SKILL" && sectionId !== "LANGUAGE" ? (
              <div className="flex justify-between text-black">
                <div className="w-4/5">
                  <p className="text-[20px] font-medium leading-7">
                    {item?.experience_title ||
                      item?.project_name ||
                      item?.certification_name}
                  </p>
                  {sectionId === "EXPERIENCE" && (
                    <p className="text-sm">
                      {item?.company_name} &#9679; {item.employment_type}
                    </p>
                  )}
                  <p className="text-xs">
                    {item?.location && item?.location + " -"}
                    {item?.location_type}
                  </p>
                  <p className="text-sm">{item?.issuing_organization}</p>
                  <p className="text-xs font-normal">
                    {dateToMonthYear(item?.start_date || item?.issue_date)} -
                    {sectionId === "EXPERIENCE" &&
                    item?.start_date === item?.end_date
                      ? "Now"
                      : dateToMonthYear(
                          item?.end_date || item?.expiration_date
                        )}
                  </p>
                  <p className="mt-2 text-xs">
                    {item?.description || item?.credential_url}
                  </p>
                </div>
                <div className="w-1/5 text-right">
                  <Button
                    type="text"
                    onClick={() => onButtonClick({ sectionId, data: item })}
                    icon={<PencilSquareIcon className="size-5" />}
                    className="mr-1"
                  />
                  <Button
                    type="text"
                    onClick={() => onDestroy({ sectionId, data: item })}
                    icon={<TrashIcon className="size-5" />}
                    className="ml-1"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center text-black">
                <div className="w-4/5">
                  <p className="text-[14px] leading-5">
                    {item?.skill_name || item?.language_name}
                  </p>
                </div>
                <div className="w-1/5 text-right">
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
    </div>
  );
};

export default UpdateProfile;
