import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  message,
  Upload,
  Image,
  Row,
  Col,
  DatePicker,
} from "antd";
import dayjs from "dayjs";
import ImgCrop from "antd-img-crop";
import customParseFormat from "dayjs/plugin/customParseFormat";
import PersonalInformationIcon from "../../../assets/svg/Personal.svg";
import { DocumentArrowUpIcon } from "@heroicons/react/24/outline";
import BrokenImage from "../../../assets/images/broken.jpg";

dayjs.extend(customParseFormat);

const PersonalInformation = ({
  open,
  setOpen,
  initialValues,
  onSubmit,
  onUploadImage,
  onRemoveImage,
}) => {
  const [form] = Form.useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(
    initialValues?.imageUrl ?? BrokenImage
  );
  const [fileList, setFileList] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const customUploadRequest = (detail) => {
    const { onSuccess } = detail;
    // Simpan file gambar ke state
    setImageFile(detail);
    setIsImageDeleted(false);
    // Tidak melakukan upload langsung
    onSuccess();
  };

  const handleFinish = async (values) => {
    try {
      setSaveLoading(true);
      if (values.date_of_birth) {
        values.date_of_birth = dayjs(values.date_of_birth).format("YYYY-MM-DD");
      }
      if (isImageDeleted) {
        // Panggil fungsi hapus gambar jika ditandai untuk dihapus
        await onRemoveImage?.();
      } else if (imageFile) {
        // Upload file gambar jika ada yang baru
        await onUploadImage(imageFile);
      }
      console.log(values);
      await onSubmit(values);
      setOpen(false);
      message.success("Profile updated successfully!");
    } catch (error) {
      console.error("handleFinish error:", error);
      message.error("Failed to update profile. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0) {
      setIsImageDeleted(false);
    }
  };

  const uploadButton = (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <img
        src={BrokenImage}
        alt="Default"
        className="absolute inset-0 w-full h-full object-cover rounded-full opacity-30"
      />
      <DocumentArrowUpIcon className="size-7 z-10" />
      <span className="font-medium text-[10px] z-10"> Upload Image</span>
    </div>
  );

  const handleRemove = () => {
    setFileList([]);
    setPreviewImage(BrokenImage);
    setImageFile(null);
    setIsImageDeleted(true);
    setPreviewOpen(false);
  };

  const validateImage = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
      return Upload.LIST_IGNORE;
    }
    return isJpgOrPng && isLt2M;
  };

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue({
        ...initialValues,
        date_of_birth: initialValues.date_of_birth ? dayjs(initialValues.date_of_birth) : null,
      });
      if (initialValues.imageUrl) {
        setPreviewImage(initialValues.imageUrl);
        setFileList([
          {
            uid: "-1",
            name: initialValues.profile_picture_url,
            status: "done",
            url: initialValues.imageUrl,
          },
        ]);
      } else {
        setPreviewImage(BrokenImage);
        setFileList([]);
      }
    }
  }, [initialValues, form, open]);

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
          <span>Personal Information</span>
        </div>
      }
      centered
      open={open}
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
      <div className="flex mb-6">
        <ImgCrop rotationSlider>
          <Upload
            accept="image/*"
            customRequest={customUploadRequest}
            listType="picture-circle"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            beforeUpload={validateImage}
            onRemove={handleRemove}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
        </ImgCrop>
        {previewImage && (
          <Image
            wrapperStyle={{ 
              display: "none",
              backgroundImage: `url(${BrokenImage})`,
              backgroundSize: "cover",
            }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
            fallback={BrokenImage}
          />
        )}
        <div className="ml-8 mt-4">
          <p className="mb-2 text-[#6C6C6C] text-[12px]">
            At least 400x400 px recommended.
            <br /> JPG or PNG up to 2MB
          </p>
          <Button
            onClick={handleRemove}
            disabled={fileList.length === 0}
            style={{
              color: fileList.length === 0 ? "#6C6C6C" : "#FF3526",
              border: "none",
              padding: 0,
              fontSize: "12px",
            }}
          >
            Delete Picture
          </Button>
        </div>
      </div>
      <Form
        form={form}
        layout="vertical"
        requiredMark={true}
        onFinish={handleFinish}
        initialValues={initialValues}
        className="text-right"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="full_name"
              label="Full Name"
              rules={[{ required: true, message: "Full Name cannot be empty" }]}
            >
              <Input style={{ borderRadius: 12, height: 56 }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone_number"
              label="Phone Number"
              rules={[
                { required: true, message: "Phone Number cannot be empty" },
              ]}
            >
              <Input
                style={{ borderRadius: 12, height: 56 }}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
                maxLength={15}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="email" label="Email">
              <Input style={{ borderRadius: 12, height: 56 }} disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="date_of_birth"
              label="Date Of Birth"
              getValueProps={(val) => ({ value: val ? dayjs(val) : null })}
            >
              <DatePicker
                size="middle"
                className="w-full"
                style={{ borderRadius: 12, height: 56 }}
                format="D MMMM YYYY"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: "Location cannot be empty" }]}
            >
              <Input.TextArea style={{ borderRadius: 12, height: 100 }} />
            </Form.Item>
          </Col>
        </Row>
        <div style={{ marginTop: 16, textAlign: "center" }}>
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
            <span className="font-medium text-sm"> Cancel </span>
          </Button>
          <Button
            type="primary"
            style={{ width: 120, height: 40, borderRadius: 12 }}
            htmlType="submit"
            loading={saveLoading}
          >
            <span className="font-medium text-sm"> Save </span>
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default PersonalInformation;
