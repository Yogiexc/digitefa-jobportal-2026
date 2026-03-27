import { useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input, App } from "antd";
import { EyeIcon, EyeSlashIcon, UserIcon } from "@heroicons/react/24/outline";
import Api from "../../services/Api";
import Logo from "../../assets/svg/Digitefaa.svg";
import logoGoogle from "../../assets/images/google.png";
import { useGoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import axios from "axios";
import sign from "jwt-encode";
import { useUserContext } from "../../UserContext";

const Login = () => {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigateTo = useNavigate();
  const { setUserData } = useUserContext();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  useGoogleOneTapLogin({
    onSuccess: (credentialResponse) => {
      loginGoogle(credentialResponse.credential);
    },
    onError: () => {
      console.error("Login Failed");
    },
  });

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
    navigateTo("/");
  };

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await Api.post("/auth/login/job-seeker", {
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
      navigateTo("/");
    } catch (error) {
      console.log(error);
      const statusCode = error?.response?.data?.statusCode || error?.data?.statusCode;
      
      if (statusCode) {
        if (statusCode === 404 || statusCode === 409) {
          message.error(
            "Login failed! User not found. Please register to create an account."
          );
        } else if (statusCode === 401) {
          message.error(
            "Login failed! Password incorrect. Please check your password again."
          );
        } else {
          message.error(error?.response?.data?.message || "Login failed. Please try again.");
        }
      } else {
        message.error("Network error. Could not connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Login Account - Digitefa</title>
        <meta name="description" content="Digitefa" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/digitefa.svg" />
      </Helmet>

      <div className="flex min-h-screen items-center justify-center bg-gray-100 py-10">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
          <div className="flex justify-center ">
            <img src={Logo} alt="Logo" className="w-48 mb-3" />
          </div>
          <h2 className="text-2xl font-semibold text-center mb-3">
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
                  className="py-3 px-4 border-[#BBB] pr-10"
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
                  className="py-3 px-4 border-[#BBB] pr-10 w-full"
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
                <Link
                  to="/forgot-password"
                  className="text-[#0553BA] hover:underline"
                >
                  Forgot Password
                </Link>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="h-10 w-full bg-green-500 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-xl focus:outline-none focus:shadow-outline mb-6"
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
              className="text-[#0553BA] hover:underline ml-1"
            >
              Register Here
            </Link>
          </p>
          <div className="flex items-center justify-center mt-5">OR</div>
          <div className="flex mt-5 mb-2 mx-auto justify-center align-center">
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

export default Login;
