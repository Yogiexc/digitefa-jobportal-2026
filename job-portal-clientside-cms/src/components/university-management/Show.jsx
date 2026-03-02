import { useEffect, useState } from "react";
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
import UniversityIcon from "../../assets/svg/University.svg";

const { Text } = Typography;
const { Content } = Layout;

const Show = ({ onBack, universityId }) => {
  const [form] = Form.useForm();
  const [universityData, setUniversityData] = useState(null);

  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const fetchData = (universityId) => {
    Api.get(`/universities/${universityId}`)
      .then((response) => {
        const universityDetail = response.data.university_detail;
        setUniversityData(universityDetail);
        form.setFieldsValue({
          university_name: universityDetail.university_name,
          category: universityDetail.category,
          email: response.data.email,
          phone_number: universityDetail.phone_number,
          country: universityDetail.country,
          province: universityDetail.province,
          city: universityDetail.city,
          district: universityDetail.district,
          full_address: universityDetail.full_address,
          postal_code: universityDetail.postal_code,
          website: universityDetail.website,
          twitter_url: universityDetail.twitter_url,
          instagram_url: universityDetail.instagram_url,
          facebook_url: universityDetail.facebook_url,
          youtube_url: universityDetail.youtube_url,
        });
        if (universityDetail.logo_url) {
          const logoUrl = `http://localhost:3000/${universityDetail.logo_url.replace(
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
        console.error("Error fetching university data:", error);
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
    if (universityId) {
      fetchData(universityId);
    }
  }, [universityId]);

  const handleBack = () => {
    onBack();
  };

  return (
    <Content>
      <br />
      <div className="bg-white shadow rounded-lg p-8">
        <div className="flex flex-col items-start mb-6">
          <div className="flex items-center mb-4">
            <img src={LogoIcon} alt="University Icon" className="w-12" />
            <Text className="text-xl font-semibold ml-4">Logo University</Text>
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
          <img src={UniversityIcon} alt="University Icon" className="w-12" />
          <Text className="text-xl font-semibold ml-4">
            University Information
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
            <Form.Item name="university_name" label="University Name">
              <Input
                style={{ borderColor: "#BBBBBB", height: "56px" }}
                disabled
              />
            </Form.Item>

            <Form.Item name="category" label="University Category">
              <Select
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
              name="phone_number"
              label="Phone Number"
              style={{ marginTop: "-16px" }}
            >
              <Input
                style={{ borderColor: "#BBBBBB", height: "56px" }}
                disabled
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
              <img src={SocialIcon} alt="Social Media Icon" className="w-12" />
              <Text className="text-xl font-semibold ml-4">Social Media</Text>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Form.Item name="website" label="University Website">
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
