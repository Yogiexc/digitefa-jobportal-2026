import { useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import Api from "../../services/Api";
import LockIcon from "../../assets/svg/Lock.svg";

const ConfirmEmail = ({ onBackToLogin }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleConfirmEmail = async (values) => {
    try {
      setLoading(true);
      const response = await Api.post(`/auth/forgot-password`, {
        email: values.email,
      });
      
      if (response.status === "success") {
        message.destroy();
        message.success(response.message || "OTP has been sent to your email!");
        navigate('/otp-verification', { state: { email: values.email } });
      } else {
        message.destroy();
        message.error(response.message || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error: ", error);
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400 && data.message.includes("email must be an email")) {
          message.destroy();
          message.error("Your email is not registered.");
        } else {
          message.destroy();
          const errorMessage = data.message || "Your email is not registered.";
          message.error(errorMessage);
        }
      } else {
        message.destroy();
        const errorMessage = error.message || "Your email is not registered.";
        message.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Confirm Email Address - CMS DIGITEFA</title>
        <meta name="description" content="DIGITEFA" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Helmet>

      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
          <div className="flex justify-center mb-6">
            <img src={LockIcon} alt="Lock" className="w-16" />
          </div>

          <h2 className="text-xl font-semibold mb-4">
            Forgot Password
          </h2>

          <p className="text-base text-[#9A9A9A] mb-6">
            Enter the email you used to create your account so we can send you
            an OTP for resetting your password.
          </p>

          <Form
            name="confirmemail"
            requiredMark={false}
            layout="vertical"
            size="large"
            className="space-y-3 text-left"
            onFinish={handleConfirmEmail}
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, type:"email", message: "Please enter your  valid email!" },
              ]}
            >
              <div className="relative">
                <Input
                  placeholder="Enter Your Email Here"
                  className="py-2 px-4 border-gray-300 pr-10 w-full"
                />
                <EnvelopeIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 size-5" />
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="h-10 w-full bg-red-500 hover:bg-red-700 text-white font-medium rounded-xl focus:outline-none focus:shadow-outline mb-6"
                loading={loading}
                disabled={loading}
              >
                Send Code
              </Button>
              <Button
                type="button"
                className="h-10 w-full bg-transparent text-red-500 border border-red-500 font-medium rounded-xl focus:outline-none focus:shadow-outline"
                onClick={onBackToLogin}
              >
                Back to Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default ConfirmEmail;
