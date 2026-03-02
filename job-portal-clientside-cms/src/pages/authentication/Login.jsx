import { useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input, message } from "antd";
import { UserIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Api from "../../services/Api";
import Logo from "../../assets/svg/DIGITEFA.svg";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigateTo = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await Api.post("/auth/login/cms", {
        email: values.email,
        password: values.password,
      });

      const { data } = response;
      const expiration = new Date();
      expiration.setDate(expiration.getDate() + 1);
      const tokenData = {
        value: data.token,
        expiresAt: expiration.getTime(),
      };
      let userData = {};
      switch (data.user.role) {
        case "superadmin":
          userData = {
            id: data.user.admin_id,
            name: data.user.full_name,
            email: data.user.email,
            password: data.user.password,
            role: data.user.role,
            expiresAt: expiration.getTime(),
          };
          break;
        case "university":
          userData = {
            id: data.user.university_id,
            name: data.user.full_name,
            email: data.user.email,
            phone_number: data.user.phone_number,
            password: data.user.password,
            role: data.user.role,
            status: data.user.status,
            expiresAt: expiration.getTime(),
          };
          break;
        case "company":
          userData = {
            id: data.user.company_id,
            name: data.user.full_name,
            email: data.user.email,
            phone_number: data.user.phone_number,
            password: data.user.password,
            role: data.user.role,
            status: data.user.status,
            expiresAt: expiration.getTime(),
          };
          break;
        default:
          throw new Error(`Unknown role: ${data.user.role}`);
      }
      if (values.remember) {
        localStorage.setItem("token", data.token);
      }
      sessionStorage.setItem("token", JSON.stringify(tokenData));
      sessionStorage.setItem("userData", JSON.stringify(userData));
      message.success("Login successful!");
      navigateTo("/dashboard?loginSuccess");
    } catch (error) {
      if (error.data.statusCode) {
        if (error.data.statusCode === 404) {
          message.destroy();
          message.error(
            "User not found. Please register to create an account."
          );
        } else if (error.data.statusCode === 401) {
          message.destroy();
          message.error(
            "Incorrect password. Please check your password again."
          );
        } else {
          message.error("Login failed. Please try again.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Login Account - CMS DIGITEFA </title>
        <meta name="description" content="Job Portal" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Helmet>

      <div className="flex min-h-screen items-center justify-center bg-gray-100 ">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
          <div className="flex justify-center ">
            <img src={Logo} alt="Logo" className="w-48" />
          </div>

          <h2 className="text-2xl font-semibold text-center text-[#232323] mb-3">
            Login to Your Account
          </h2>

          <Form
            name="login"
            requiredMark={false}
            initialValues={{ remember: false }}
            layout="vertical"
            size="large"
            className="space-y-3 text-left"
            onFinish={handleLogin}
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please enter your email",
                },
              ]}
            >
              <div className="relative">
                <Input
                  placeholder="Enter Your Email"
                  className="py-2 px-4 border-[#bbb] pr-10 w-full"
                />
                <UserIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 size-5" />
              </div>
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please enter your password" },
                { min: 8, message: "Password must be at least 8 characters" },
              ]}
            >
              <div className="relative">
                <Input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Enter Your Password"
                  className="py-2 px-4 border-[#bbb] pr-10 w-full"
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

            <Form.Item>
              <div className="flex justify-between items-center mb-3">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox> Remember Me</Checkbox>
                </Form.Item>
                <a
                  href="/forgot-password"
                  className="text-[#0553BA] hover:underline"
                >
                  Forgot Password
                </a>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="h-10 w-full bg-red-500 hover:bg-red-700 text-white font-medium py-1 px-4 rounded-xl focus:outline-none focus:shadow-outline mb-6"
                loading={loading}
                disabled={loading}
              >
                Login
              </Button>
            </Form.Item>
          </Form>

          <p className="text-[#232323] text-sm">
            {`Don't Have an Account?`}
            <Link
              to="/register"
              className="text-[#065BCC] hover:underline ml-1"
            >
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Login;
