import { useEffect, useState } from "react";
import { Button, Upload, Card, message, Spin } from "antd";
import { ArrowRightIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { getUserSession, previewImageUrl } from "../../utils";
import PersonalInformation from "./PersonalInformation";
import { useJobApply } from "../../pages/job-apply/JobApplyContext";
import {
  InboxOutlined,
  UserOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileImageOutlined,
  FileTextOutlined,
  FileUnknownOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import Api from "../../services/Api";
import { useOnMountUnsafe } from "../../hooks/useMountUnsave";

import brokenImage from "../../assets/images/broken.jpg";

const { Dragger } = Upload;

const ChooseDocument = ({ onNext }) => {
  const [openPersonalInformation, setOpenPersonalInformation] = useState(false);
  const { formData, updateFormData } = useJobApply();
  const [loading, setLoading] = useState(true);

  const [fileList, setFileList] = useState([]);

  const handleNext = () => {
    if (!formData.upload_resume) {
      message.error("Please upload your resume before continuing.");
      return;
    }
    onNext();
  };

  useEffect(() => {
    if (formData.upload_resume) {
      setFileList([
        {
          uid: formData.upload_resume.uid || Date.now(),
          name: formData.upload_resume.name,
          status: "done", 
          url: formData.upload_resume instanceof File ? URL.createObjectURL(formData.upload_resume) : formData.upload_resume, 
        },
      ]);
    } else {
      setFileList([]);
    }
  }, [formData.upload_resume]);
  const getFileIcon = (file) => {
    const name = file.name || "";
    if (name.endsWith(".pdf")) return <FilePdfOutlined style={{ color: "#f5222d", fontSize: "24px" }} />;
    if (name.match(/\.(doc|docx)$/i)) return <FileWordOutlined style={{ color: "#1890ff", fontSize: "24px" }} />;
    if (name.match(/\.(png|jpg|jpeg)$/i)) return <FileImageOutlined style={{ color: "#52c41a", fontSize: "24px" }} />;
    if (name.match(/\.(txt|rtf)$/i)) return <FileTextOutlined style={{ color: "#fa8c16", fontSize: "24px" }} />;
    return <FileUnknownOutlined style={{ fontSize: "24px" }} />;
  };

  const props = {
    name: "file",
    multiple: false,
    showUploadList: false,
    fileList,
    accept: ".pdf,.doc,.docx,.txt,.rtf,.png,.jpg,.jpeg,",
    iconRender: getFileIcon,
  
    beforeUpload(file) {
      updateFormData("upload_resume", file);
      return false; // Prevent auto upload
    },
  
    onChange(info) {
      const { status } = info.file;
      if (status === 'removed') {
        updateFormData("upload_resume", null);
      }
    },
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="flex w-full">
          <Card className="jobportal-section mb-8 w-[40%]">
            <Card.Meta
              description={
                <div className="flex justify-between items-center w-full">
                  <img
                    src={imageUrl || brokenImage}
                    alt="Profile"
                    className="w-[110px] h-[110px] rounded-full mr-5 ml-1 border border-[#BBBBBB] p-2"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = brokenImage;
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
        </div>

        <h3 className="font-medium text-[#232323] text-xl">Resume</h3>
        <p className="text-[#9A9A9A] mb-8">
          Choose file accepted file types: .doc, .docx, .pdf, .txt and .rtf
          (10MB limit).
        </p>
        <div className="lg:w-[40%]">
          {" "}
          <Dragger {...props} maxCount={1}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag your resume/CV to this area to upload
            </p>
            <p className="ant-upload-hint">
              Supports single file upload only. Uploading company data or other
              prohibited files is strictly forbidden.
            </p>
          </Dragger>

          {formData.upload_resume && (
            <div className="mt-4 p-4 border border-dashed border-[#E0E0E0] rounded-2xl flex items-center justify-between bg-[#F9F9F9]">
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
              <Button 
                type="text" 
                danger 
                shape="circle"
                icon={<DeleteOutlined className="size-4" />} 
                onClick={() => updateFormData("upload_resume", null)}
                className="hover:bg-red-50 flex items-center justify-center"
              />
            </div>
          )}
        </div>
        {/* <Upload maxCount={1}>
          <Button
            type="primary"
            style={{
              width: 140,
              height: 40,
              backgroundColor: "#E3FCEC",
              color: "#06A73B",
              borderRadius: 12,
            }}
          >
            <span className="font-medium text-sm">Upload Resume</span>
          </Button>
        </Upload> */}

        <div className="flex justify-end mt-8">
          <Button
            type="primary"
            style={{
              width: 140,
              height: 40,
              borderRadius: 10,
            }}
            onClick={handleNext}
          >
            <span className="font-medium text-sm">Continue</span>
            <ArrowRightIcon className="size-4" />
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
    </>
  );
};

export default ChooseDocument;
