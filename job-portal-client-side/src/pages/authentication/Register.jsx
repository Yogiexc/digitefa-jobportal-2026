import { useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input, App } from "antd";
import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Api from "../../services/Api";
import Logo from "../../assets/svg/Digitefaa.svg";
import logoGoogle from "../../assets/images/google.png";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import sign from "jwt-encode";
import { useUserContext } from "../../UserContext";

const Register = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const { setUserData } = useUserContext();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const userInfo = await axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        .then((res) => res.data);
      const credential = sign(userInfo, "secret");
      loginGoogle(credential);
    },
    onError: (error) => console.error(error),
    flow: "implicit",
  });

  const loginGoogle = async (credential) => {
    const loginGoogle = await Api.post("/auth/login/google", { credential });
    const { data } = loginGoogle;
    const expiration = new Date();
    expiration.setDate(expiration.getDate() + 1);
    const tokenData = {
      value: data.token,
      expiresAt: expiration.getTime(),
    };

    const userData = {
      id: data.user.job_seeker_id,
      name: data.user.full_name,
      email: data.user.email,
      role: data.user.role,
      expiresAt: expiration.getTime(),
    };

    localStorage.setItem("token", JSON.stringify(tokenData));
    localStorage.setItem("userData", JSON.stringify(userData));
    setUserData(userData);
    message.success("Login successful!");
    navigate("/");
  };

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      const data = {
        full_name: values.full_name,
        email: values.email,
        password: values.password,
      };
      await Api.post(`/auth/register/job-seeker`, data)
        .then((response) => {
          const { data } = response;
          message.success("Registration successful! OTP send. Please check your email.");
          navigate("/verification-account", {
            state: { ...data, email: values.email },
          });
        })
        .catch((error) => {
          const statusCode = error?.response?.data?.statusCode || error?.data?.statusCode;
          if (statusCode === 409 || statusCode === 404) {
            message.error("Registration failed! Account is already registered or invalid input.");
          } else {
            message.error(error?.response?.data?.message || error?.data?.message || "Registration failed. Please try again.");
          }
        });
    } catch (error) {
      message.error(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Register Account - Digitefa</title>
        <meta name="description" content="Digitefa" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/digitefa.svg" />
      </Helmet>

      <div className="flex min-h-screen items-center justify-center bg-gray-100 py-10">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xl text-center">
          <div className="flex justify-center">
            <img src={Logo} alt="Logo" className="w-48 " />
          </div>

          <h2 className="text-2xl font-semibold text-center mb-6">
            Register New Account
          </h2>

          <Form
            form={form}
            name="register"
            requiredMark={false}
            initialValues={{ remember: false }}
            layout="vertical"
            size="large"
            className="space-y-3 text-left"
            onFinish={handleRegister}
            autoComplete="off"
          >
            <Form.Item
              name="full_name"
              label="Full Name"
              rules={[
                { required: true, message: "Please enter your full name" },
              ]}
            >
              <div className="relative">
                <Input
                  placeholder="Enter Your Full Name Here"
                  className="py-3 px-4 border-[#BBB] pr-10"
                />
                <UserIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 size-5" />
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
                  placeholder="Enter Your Email Here"
                  className="py-3 px-4 border-[#BBB] pr-10"
                />
                <EnvelopeIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 size-5" />
              </div>
            </Form.Item>

            {/* <Form.Item>
              <Form.Item
                name="phone_number"
                label="Phone Number"
                className="-mt-4"
              >
                <Input
                  placeholder="Enter Your Phone Number Here"
                  className="-mt-2 py-3 px-4 border-[#BBB] pr-10"
                />
                <PhoneIcon className="size-5 absolute right-3 top-2" />
              </Form.Item>
            </Form.Item> */}

            <div className="flex md:space-x-3 flex-col md:flex-row">
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  {
                    required: true,
                    message: "Please enter your password",
                  },
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
                    className="py-3 px-4 border-[#BBB] pr-10"
                    autoComplete="new-password"
                  />
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {passwordVisible ? (
                      <EyeIcon className="size-5 text-black" />
                    ) : (
                      <EyeSlashIcon className="size-5 text-black" />
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
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Confirm Your Password"
                    className="py-3 px-4 border-[#BBB] pr-10"
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
                <a href="#" className="underline hover:underline ml-1">
                  terms and condition
                </a>
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="submit"
                htmlType="submit"
                className="h-10 w-full bg-green-500 hover:bg-green-700 text-white font-medium py-1 px-4 rounded-xl focus:outline-none focus:shadow-outline mb-4"
                loading={loading}
                disabled={loading}
              >
                Register
              </Button>
            </Form.Item>
          </Form>

          <p className="text-[#232323] text-sm">
            Already Have Account?
            <Link to="/login" className="text-[#065BCC] hover:underline ml-1">
              Login Here
            </Link>
          </p>

          <div className="flex items-center justify-center mt-5">OR</div>
          <div className="flex mt-5 mb-3 mx-auto justify-center align-center">
            <Button
              onClick={loginWithGoogle}
              className="w-full flex items-center justify-between px-5 py-5 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-lg font-medium"
            >
              <img
                className="h-5 w-5 mr-2"
                src={logoGoogle}
                alt="Google Logo"
              />
              <div className="w-full text-center">
                <span className="text-gray-700 font-medium">
                  Login with Google
                </span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Register;
