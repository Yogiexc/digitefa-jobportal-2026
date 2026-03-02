import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Image,
  Form,
  Typography,
  Select,
  Upload,
  message,
  Spin,
} from "antd";
import Api from "../../../services/Api";
import LogoIcon from "../../../assets/svg/Logo.svg";
import AddressIcon from "../../../assets/svg/Address.svg";
import SocialIcon from "../../../assets/svg/Social.svg";
import CompanyIcon from "../../../assets/svg/Company.svg";
import { DocumentArrowUpIcon } from "@heroicons/react/24/outline";
import ImgCrop from "antd-img-crop";

const { Text } = Typography;

const ProfileCompany = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const fetchData = () => {
    setLoading(true);
    Api.get(`/profile/company`)
      .then((response) => {
        const companyDetail = response.data.company_detail;

        if (companyDetail) {
          form.setFieldsValue({
            legal_name: companyDetail.legal_name,
            market_name: companyDetail.market_name,
            email: response.data.email,
            category: companyDetail.category,
            phone_number: response.data.phone_number,
            company_size: companyDetail.company_size,
            description: companyDetail.description,
            country: companyDetail.country,
            province: companyDetail.province,
            city: companyDetail.city,
            district: companyDetail.district,
            full_address: companyDetail.full_address,
            postal_code: companyDetail.postal_code,
            website: companyDetail.website,
            facebook_url: companyDetail.facebook_url,
            twitter_url: companyDetail.twitter_url,
            instagram_url: companyDetail.instagram_url,
            youtube_url: companyDetail.youtube_url,
          });

          if (companyDetail.logo_url) {
            const logoUrl = `http://localhost:3000/${companyDetail.logo_url.replace(
              /\\/g,
              "/"
            )}`;
            setFileList([
              {
                uid: "-1",
                name: "logo.png",
                status: "done",
                url: logoUrl,
              },
            ]);
            setPreviewImage(logoUrl);
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        if (fileList.length === 0) {
          message.destroy();
          message.error("Please upload a logo");
          return;
        }
        const payload = {
          upload_logo: fileList[0] ? fileList[0].originFileObj : null,
          market_name: values.market_name,
          category: values.category,
          company_size: values.company_size,
          description: values.description,
          country: values.country,
          province: values.province,
          city: values.city,
          district: values.district,
          full_address: values.full_address,
          postal_code: values.postal_code,
          website: values.website,
          facebook_url: values.facebook_url,
          twitter_url: values.twitter_url,
          instagram_url: values.instagram_url,
          youtube_url: values.youtube_url,
        };

        const formData = new FormData();
        Object.keys(payload).forEach((key) => {
          if (payload[key]) {
            formData.append(key, payload[key]);
          }
        });

        Api.put(`/profile/company`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
          .then(() => {
            message.destroy();
            message.success("Your Company Profile Successfully Updated");
          })
          .catch((error) => {
            console.error("Error:", error);
            message.destroy();
            message.error("Failed to update company");
          });
      })
      .catch(() => {
        // error handling
      });
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

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const handleRemove = () => {
    setFileList([]);
    setPreviewImage("");
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

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
      type="button"
    >
      <DocumentArrowUpIcon />
      <div
        style={{
          marginLeft: 8,
        }}
      >
        Upload Logo
      </div>
    </button>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white shadow rounded-xl p-8">
        <div className="flex flex-col items-start mb-6">
          <div className="flex items-center mb-4">
            <img src={LogoIcon} alt="Company Icon" className="w-12" />
            <Text className="text-xl font-semibold ml-4">Logo Company</Text>
          </div>
          <div className="flex items-center mt-4">
            <ImgCrop rotationSlider>
              <Upload
                listType="picture-card"
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
                }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
              />
            )}
            <div className="ml-8">
              <p className="mb-2 text-[#6C6C6C] text-[12px]">
                At least 800x800 px recommended.
                <p> JPG or PNG up to 2MB</p>
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
        </div>

        <div className="flex items-center mb-6">
          <img src={CompanyIcon} alt="Company Icon" className="w-12" />
          <Text className="text-xl font-semibold ml-4">
            Company Information
          </Text>
        </div>

        <Form form={form} layout="vertical" requiredMark={false} size="large">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Form.Item name="legal_name" label="Company Legal Name">
              <Input disabled />
            </Form.Item>

            <Form.Item
              name="market_name"
              label="Company Market Name"
              rules={[
                { required: true, message: "Please enter company market name" },
              ]}
            >
              <Input placeholder="Please Enter Your Company Market Here" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              style={{ marginTop: "-16px" }}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              style={{ marginTop: "-16px" }}
              rules={[
                {
                  required: true,
                  message: "Please enter your company category",
                },
              ]}
            >
              <Input placeholder="Please Enter Category of Your Company Here" />
            </Form.Item>

            <Form.Item
              name="phone_number"
              label="Phone Number"
              style={{ marginTop: "-16px" }}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              name="company_size"
              label="Company Size"
              style={{ marginTop: "-16px" }}
              rules={[
                { required: true, message: "Please select your company size" },
              ]}
            >
              <Select
                style={{ height: "56px" }}
                placeholder="Please Select Company Size Here"
              >
                <Select.Option value="1-50 employees">
                  1-50 employees
                </Select.Option>
                <Select.Option value="51-200 employees">
                  51-200 employees
                </Select.Option>
                <Select.Option value="20-99 employees">
                  201-500 employees
                </Select.Option>
                <Select.Option value="100-499 employees">
                  &gt; 500 employees
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              style={{ marginTop: "-16px" }}
              rules={[
                {
                  required: true,
                  message: "Please fill description about your company",
                },
              ]}
            >
              <Input.TextArea
                placeholder="Please Fill Description About Your Company Here"
                style={{ height: "96px" }}
              />
            </Form.Item>
          </div>

          <div className="mt-6">
            <div className="flex items-center mb-4">
              <img src={AddressIcon} alt="Address Icon" className="w-12" />
              <Text className="text-xl font-semibold ml-4">
                Address Information
              </Text>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Form.Item
                name="country"
                label="Country"
                rules={[
                  { required: true, message: "Please enter company country" },
                ]}
              >
                <Input placeholder="Please Enter Country Here" />
              </Form.Item>

              <Form.Item
                name="province"
                label="Province"
                rules={[
                  {
                    required: true,
                    message: "Please enter your company province",
                  },
                ]}
              >
                <Input placeholder="Please Enter Province Here" />
              </Form.Item>

              <Form.Item
                name="city"
                label="City"
                style={{ marginTop: "-16px" }}
                rules={[
                  { required: true, message: "Please enter your company city" },
                ]}
              >
                <Input placeholder="Please Enter City Here" />
              </Form.Item>

              <Form.Item
                name="district"
                label="District"
                style={{ marginTop: "-16px" }}
                rules={[
                  {
                    required: true,
                    message: "Please enter your company district",
                  },
                ]}
              >
                <Input placeholder="Please Enter District Here" />
              </Form.Item>

              <Form.Item
                name="full_address"
                label="Full Address"
                style={{ marginTop: "-16px" }}
                rules={[
                  {
                    required: true,
                    message: "Please write full address of your company",
                  },
                ]}
              >
                <Input.TextArea
                  placeholder="Please Write Full Address of Your Company Here"
                  style={{ height: "96px" }}
                />
              </Form.Item>

              <Form.Item
                name="postal_code"
                label="Postal Code"
                style={{ marginTop: "-16px" }}
                rules={[
                  {
                    required: true,
                    message: "Please enter your company postal code",
                  },
                ]}
              >
                <Input placeholder="Please Enter Postal Code Here" />
              </Form.Item>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center mb-4">
              <img src={SocialIcon} alt="Social Media Icon" className="w-12" />
              <Text className="text-xl font-semibold ml-4">Social Media</Text>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Form.Item
                name="website"
                label="Company Website"
                rules={[
                  {
                    required: true,
                    message: "Please enter your company domain",
                  },
                  { type: "url", warningOnly: true },
                ]}
              >
                <Input placeholder="Please Enter Company Domain Here" />
              </Form.Item>

              <Form.Item
                name="twitter_url"
                label="Twitter"
                rules={[
                  {
                    required: true,
                    message: "Please enter your twitter handle",
                  },
                ]}
              >
                <Input placeholder="Please Enter Your Twitter Handle Here" />
              </Form.Item>

              <Form.Item
                name="instagram_url"
                label="Instagram"
                style={{ marginTop: "-16px" }}
                rules={[
                  {
                    required: true,
                    message: "Please enter your instagram username",
                  },
                ]}
              >
                <Input placeholder="Please Enter Your Instagram Username Here" />
              </Form.Item>

              <Form.Item
                name="facebook_url"
                label="Facebook"
                style={{ marginTop: "-16px" }}
                rules={[
                  {
                    required: true,
                    message: "Please enter your facebook profile",
                  },
                ]}
              >
                <Input placeholder="Please Enter Your Facebook Profile Here " />
              </Form.Item>

              <Form.Item
                name="youtube_url"
                label="Youtube"
                style={{ marginTop: "-16px" }}
                rules={[
                  {
                    required: true,
                    message: "Please enter your youtube channel",
                  },
                ]}
              >
                <Input placeholder="Please Enter Your Youtube Channel Name Here" />
              </Form.Item>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              type="primary"
              style={{
                width: "120px",
                height: "40px",
                borderRadius: "12px",
              }}
              onClick={handleSave}
            >
              <span className="font-medium text-sm">Save</span>
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ProfileCompany;
