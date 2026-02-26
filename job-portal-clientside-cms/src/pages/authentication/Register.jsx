import { useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Checkbox, Tabs, message } from "antd";
import {
  AcademicCapIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Api from "../../services/Api";
import Logo from "../../assets/svg/DIGITEFA.svg";

const Register = () => {
  const [companyForm] = Form.useForm();
  const [universityForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("company");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleRegister = async (values) => {
    try {
      setLoading(true);
      let data = {};
      let state = {};

      if (userType === "company") {
        data = {
          legal_name: values.legal_name,
          full_name: values.full_name,
          phone_number: values.phone_number,
          email: values.email,
          password: values.password,
        };
        state = {
          legal_name: values.legal_name,
          email: values.email,
          phone_number: values.phone_number,
        };
      } else if (userType === "university") {
        data = {
          university_name: values.university_name,
          full_name: values.full_name,
          email: values.email,
          password: values.password,
        };
        state = {
          university_name: values.university_name,
          email: values.email,
        };
      }

      await Api.post(`/auth/register/${userType}`, data)
        .then(() => {
          message.destroy();
          message.success("OTP Send. Please check your email.");
          navigate("/verification-account", { state: { ...state } });
        })
        .catch((error) => {
          if (error.data) {
            const errorData = error.data.message;
            if (error.data.status === 409) {
              message.destroy();
              message.error(errorData);
            } else {
              message.destroy();
              message.error(errorData);
            }
          } else {
            message.destroy();
            message.error(error.message);
          }
        });
    } catch (error) {
      message.destroy();
      message.error(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = () => {
    //
  };

  const handleTabChange = (key) => {
    setUserType(key);
    if (key === "company") {
      companyForm.resetFields();
    } else {
      universityForm.resetFields();
    }
  };

  const items = [
    {
      label: "Company",
      key: "company",
      children: (
        <Form
          form={companyForm}
          name="company_register"
          requiredMark={false}
          initialValues={{ remember: false }}
          layout="vertical"
          size="large"
          className="space-y-3 text-left"
          onFinish={handleRegister}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="legal_name"
            label="Company Name"
            rules={[
              { required: true, message: "Please enter your company name" },
            ]}
          >
            <div className="relative">
              <Input
                placeholder="Enter Your Company Name"
                className="py-2 px-4 border-[#BBB] pr-10 w-full"
              />
              <BuildingOfficeIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 size-5 " />
            </div>
          </Form.Item>

          <Form.Item
            name="full_name"
            label="Full Name"
            style={{ marginBottom: 30 }}
            rules={[{ required: true, message: "Please enter your full name" }]}
          >
            <div className="relative">
              <Input
                placeholder="Enter Your Full Name"
                className="py-2 px-4 border-[#BBB] pr-10 w-full"
              />
              <UserIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 size-5" />
            </div>
          </Form.Item>

          <Form.Item
            name="phone_number"
            label="Phone Number"
            style={{ marginBottom: 30 }}
            rules={[
              { required: true, message: "Please enter your phone number" },
            ]}
          >
            <div className="relative">
              <Input
                placeholder="Enter Your Phone Number"
                className="py-2 px-4 border-[#BBB] pr-10 w-full"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
                maxLength={15}
              />
              <PhoneIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 size-5" />
            </div>
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            style={{ marginBottom: 30 }}
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
          >
            <div className="relative">
              <Input
                placeholder="Enter Your Email"
                className="py-2 px-4 border-[#BBB] pr-10 w-full"
              />
              <EnvelopeIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 size-5" />
            </div>
          </Form.Item>

          <div className="flex space-x-2 ">
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please enter your password" },
                {
                  min: 8,
                  message: "Password must be at least 8 characters",
                },
              ]}
            >
              <div className="relative">
                <Input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Enter Your Password"
                  className="py-2 px-4 border-[#BBB] pr-10 "
                />
                <div
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? (
                    <EyeIcon className="size-5" />
                  ) : (
                    <EyeSlashIcon className="size-5" />
                  )}
                </div>
              </div>
            </Form.Item>

            <Form.Item
              name="confirm_password"
              label="Confirm Password"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match!")
                    );
                  },
                }),
              ]}
            >
              <div className="relative">
                <Input
                  type={confirmPasswordVisible ? "text" : "password"}
                  placeholder="Confirm Your Password"
                  className="py-2 px-4 border-[#BBB] pr-10 w-full"
                />
                <div
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {confirmPasswordVisible ? (
                    <EyeIcon className="size-5" />
                  ) : (
                    <EyeSlashIcon className="size-5 " />
                  )}
                </div>
              </div>
            </Form.Item>
          </div>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Please agree to the terms and conditions")
                      ),
              },
            ]}
          >
            <Checkbox style={{ marginBottom: 16 }}>
              I agree to the
              <a href="#" className="underline hover:underline ml-1 ">
                terms and condition
              </a>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="submit"
              htmlType="submit"
              className="h-10 w-full bg-red-500 hover:bg-red-700 text-white font-medium rounded-xl focus:outline-none focus:shadow-outline mb-3"
              loading={loading}
              disabled={loading}
            >
              Register
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      label: "University",
      key: "university",
      children: (
        <Form
          form={universityForm}
          name="university_register"
          requiredMark={false}
          initialValues={{ remember: false }}
          layout="vertical"
          size="large"
          className="space-y-3 text-left"
          onFinish={handleRegister}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="university_name"
            label="University Name"
            rules={[
              userType === "university"
                ? {
                    required: true,
                    message: "Please enter your university name",
                  }
                : { required: false },
            ]}
          >
            <div className="relative">
              <Input
                placeholder="Enter Your University Name"
                className="py-2 px-4 border-[#BBB] pr-10 w-full"
              />
              <AcademicCapIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 size-5 " />
            </div>
          </Form.Item>

          <Form.Item
            name="full_name"
            label="Full Name"
            style={{ marginBottom: 30 }}
            rules={[{ required: true, message: "Please enter your full name" }]}
          >
            <div className="relative">
              <Input
                placeholder="Enter Your Full Name"
                className="py-2 px-4 border-[#BBB] pr-10 w-full"
              />
              <UserIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 size-5 " />
            </div>
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            style={{ marginBottom: 30 }}
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
          >
            <div className="relative">
              <Input
                placeholder="Enter Your Email"
                className="py-2 px-4 border-[#BBB] pr-10 w-full"
              />
              <EnvelopeIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 size-5 " />
            </div>
          </Form.Item>

          <div className="flex justify-between space-x-4 -mt-4">
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please enter your password" },
                {
                  min: 8,
                  message: "Password must be at least 8 characters",
                },
              ]}
            >
              <div className="relative">
                <Input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Enter Your Password"
                  className="py-2 px-4 border-[#BBB] pr-10 w-full"
                />
                <div
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? (
                    <EyeIcon className="size-5" />
                  ) : (
                    <EyeSlashIcon className="size-5 " />
                  )}
                </div>
              </div>
            </Form.Item>

            <Form.Item
              name="confirm_password"
              label="Confirm Password"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match!")
                    );
                  },
                }),
              ]}
            >
              <div className="relative">
                <Input
                  type={confirmPasswordVisible ? "text" : "password"}
                  placeholder="Confirm Your Password"
                  className="py-2 px-4 border-[#BBB] pr-10 w-full"
                />
                <div
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {confirmPasswordVisible ? (
                    <EyeIcon className="size-5" />
                  ) : (
                    <EyeSlashIcon className="size-5" />
                  )}
                </div>
              </div>
            </Form.Item>
          </div>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Please agree to the terms and conditions")
                      ),
              },
            ]}
          >
            <Checkbox style={{ marginBottom: 16 }}>
              I agree to the
              <a href="#" className="underline hover:underline ml-1 ">
                terms and condition
              </a>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="submit"
              htmlType="submit"
              className="h-10 w-full bg-red-500 hover:bg-red-700 text-white font-medium rounded-xl focus:outline-none focus:shadow-outline mb-3"
              loading={loading}
              disabled={loading}
            >
              Register
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <HelmetProvider>
      <Helmet>
        <title>Register Account - CMS DIGITEFA</title>
        <meta name="description" content="Job Portal" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Helmet>

      <div className="flex min-h-screen items-center justify-center bg-gray-100 py-10">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xl text-center">
          <div className="flex justify-center">
            <img src={Logo} alt="Logo" className="w-48" />
          </div>

          <h2 className="text-2xl font-semibold text-center mb-3">
            Register New Account
          </h2>

          <Tabs
            onChange={handleTabChange}
            centered
            type="card"
            activeKey={userType}
            items={items}
          />

          <p className="text-[#232323] text-sm mt-3">
            Already Have Account?
            <Link to="/login" className="text-[#065BCC] hover:underline ml-1">
              Login Here
            </Link>
          </p>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Register;
