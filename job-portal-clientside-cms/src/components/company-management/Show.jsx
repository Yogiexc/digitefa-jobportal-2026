import { useState, useEffect } from "react";
import {
  Form,
  Typography,
  Select,
  Input,
  Button,
  Image,
  Upload,
  Layout,
} from "antd";
import Api from "../../services/Api";
import LogoIcon from "../../assets/svg/Logo.svg";
import AddressIcon from "../../assets/svg/Address.svg";
import SocialIcon from "../../assets/svg/Social.svg";
import CompanyIcon from "../../assets/svg/Company.svg";

const { Text } = Typography;
const { Content } = Layout;

const Show = ({ onBack, companyId }) => {
  const [form] = Form.useForm();
  const [companyData, setCompanyData] = useState(null);

  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const fetchData = (companyId) => {
    Api.get(`/companies/${companyId}`)
      .then((response) => {
        const companyDetail = response.data.company_detail;
        setCompanyData(companyDetail);
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
          twitter_url: companyDetail.twitter_url,
          instagram_url: companyDetail.instagram_url,
          facebook_url: companyDetail.facebook_url,
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
      })
      .catch((error) => {
        console.error("Error fetching company data:", error);
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

  useEffect(() => {
    if (companyId) {
      fetchData(companyId);
    }
  }, [companyId]);

  const handleBack = () => {
    onBack();
  };

  return (
    <Content>
      <br />
      <div className="bg-white shadow rounded-lg p-8">
        <div className="flex flex-col items-start mb-6">
          <div className="flex items-center mb-4">
            <img src={LogoIcon} alt="company Icon" className="w-12" />
            <Text className="text-xl font-semibold ml-4">Logo Company</Text>
          </div>
          <div className="flex items-center justify-center mt-4">
            <Upload
              action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
            ></Upload>
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
          </div>
        </div>

        <div className="flex items-center mb-6">
          <img src={CompanyIcon} alt="company Icon" className="w-12" />
          <Text className="text-xl font-semibold ml-4">
            Company Information
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          className="w-full"
          size="large"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Form.Item name="legal_name" label="Company Legal Name">
              <Input
                style={{ borderColor: "#BBBBBB", height: "56px" }}
                disabled
              />
            </Form.Item>

            <Form.Item name="market_name" label="Company Market Name">
              <Input
                style={{ borderColor: "#BBBBBB", height: "56px" }}
                disabled
                open={false}
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              style={{ marginTop: "-16px" }}
            >
              <Input
                style={{ borderColor: "#BBBBBB", height: "56px" }}
                disabled
              />
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              style={{ marginTop: "-16px" }}
            >
              <Input
                style={{ borderColor: "#BBBBBB", height: "56px" }}
                disabled
                open={false}
              />
            </Form.Item>

            <Form.Item
              name="phone_number"
              label="Phone Number"
              style={{ marginTop: "-16px" }}
            >
              <Input
                style={{ borderColor: "#BBBBBB", height: "56px" }}
                disabled
              />
            </Form.Item>

            <Form.Item
              name="company_size"
              label="Company Size"
              style={{ marginTop: "-16px" }}
            >
              <Select
                style={{ borderColor: "#BBBBBB", height: "56px" }}
                disabled
                open={false}
              />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              style={{ marginTop: "-16px" }}
            >
              <Input.TextArea
                style={{ borderColor: "#BBBBBB", height: "96px" }}
                disabled
              />
            </Form.Item>
          </div>

          <div className="mt-6">
            <div className="flex items-center mb-4">
              <img
                src={AddressIcon}
                alt="Address Icon"
                className="w-12"
                disabled
              />
              <Text className="text-xl font-semibold ml-4">
                Address Information
              </Text>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Form.Item name="country" label="Country">
                <Input
                  style={{ borderColor: "#BBBBBB", height: "56px" }}
                  disabled
                  open={false}
                />
              </Form.Item>

              <Form.Item name="province" label="Province">
                <Input
                  style={{ borderColor: "#BBBBBB", height: "56px" }}
                  disabled
                  open={false}
                />
              </Form.Item>

              <Form.Item
                name="city"
                label="City"
                style={{ marginTop: "-16px" }}
              >
                <Input
                  style={{ borderColor: "#BBBBBB", height: "56px" }}
                  disabled
                  open={false}
                />
              </Form.Item>

              <Form.Item
                name="district"
                label="District"
                style={{ marginTop: "-16px" }}
              >
                <Input
                  style={{ borderColor: "#BBBBBB", height: "56px" }}
                  disabled
                  open={false}
                />
              </Form.Item>

              <Form.Item
                name="full_address"
                label="Full Address"
                style={{ marginTop: "-16px" }}
              >
                <Input.TextArea
                  style={{ borderColor: "#BBBBBB", height: "96px" }}
                  disabled
                />
              </Form.Item>

              <Form.Item
                name="postal_code"
                label="Postal Code"
                style={{ marginTop: "-16px" }}
              >
                <Input
                  style={{ borderColor: "#BBBBBB", height: "56px" }}
                  disabled
                  open={false}
                />
              </Form.Item>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center mb-4">
              <img
                src={SocialIcon}
                alt="Social Media Icon"
                className="w-12"
                disabled
              />
              <Text className="text-xl font-semibold ml-4">Social Media</Text>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Form.Item name="website" label="company Website">
                <Input
                  style={{ borderColor: "#BBBBBB", height: "56px" }}
                  disabled
                />
              </Form.Item>

              <Form.Item name="twitter_url" label="Twitter">
                <Input
                  style={{ borderColor: "#BBBBBB", height: "56px" }}
                  disabled
                />
              </Form.Item>

              <Form.Item
                name="instagram_url"
                label="Instagram"
                style={{ marginTop: "-16px" }}
              >
                <Input
                  style={{ borderColor: "#BBBBBB", height: "56px" }}
                  disabled
                />
              </Form.Item>

              <Form.Item
                name="facebook_url"
                label="Facebook"
                style={{ marginTop: "-16px" }}
              >
                <Input
                  style={{ borderColor: "#BBBBBB", height: "56px" }}
                  disabled
                />
              </Form.Item>

              <Form.Item
                name="youtube_url"
                label="Youtube"
                style={{ marginTop: "-16px" }}
              >
                <Input
                  style={{ borderColor: "#BBBBBB", height: "56px" }}
                  disabled
                />
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
              onClick={handleBack}
            >
              <span className="font-medium font-base">Back</span>
            </Button>
          </div>
        </Form>
      </div>
    </Content>
  );
};

export default Show;
