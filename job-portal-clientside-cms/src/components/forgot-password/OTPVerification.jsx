import { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Button, message } from "antd";
import { InputOTP } from "antd-input-otp";
import Api from "../../services/Api";
import LockIcon from "../../assets/svg/Lock.svg";

const OTPVerification = () => {
  const [form] = Form.useForm();
  const [value, setValue] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state?.email) {
      navigate("/forgot-password");
    }
  }, []);

  const handleFinish = async (values) => {
    const email = location.state?.email;

    if (!email) {
      message.destroy();
      message.error("Email not provided. Please register again.");
      return;
    }

    const otp = values.otpverification?.join("");

    if (!otp) {
      message.destroy();
      message.error("Please enter the OTP.");
      return;
    }

    try {
      setLoading(true);
      const response = await Api.post("/auth/verify-otp-for-reset", {
        email: email,
        otp: otp,
      });

      if (response) {
        const { status, message: responseMessage } = response;
        if (status === "success") {
          message.destroy();
          message.success(responseMessage || "Email verified successfully. Please reset your password.");
          navigate("/reset-password", { state: { email: email, otp: otp } }); // Pass email and otp in state
        } else {
          message.destroy();
          message.error(responseMessage || "Invalid or expired OTP");
        }
      } else {
        message.destroy();
        message.error("Unexpected response structure");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      message.destroy();
      if (error.response && error.response.data) {
        message.error(error.response.data.message || "Verification failed. Please try again.");
      } else {
        message.error("Verification failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const email = location.state?.email;

    if (!email) {
      message.error("Email not provided. Please register again.");
      return;
    }

    try {
      setLoading(true);
      await Api.post("/auth/forgot-password", { email });
      message.success("OTP has been resent to your email.");
    } catch (error) {
      message.error("Failed to resend OTP. Please try again.");
      console.error("Failed to resend OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  const onBackToLogin = () => {
    navigate("/login");
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>OTP Verification Forgot Password - CMS DIGITEFA</title>
        <meta name="description" content="DIGITEFA" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Helmet>

      <div className="flex min-h-screen items-center justify-center bg-gray-100 py-10">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
          <div className="flex justify-center mb-6">
            <img src={LockIcon} alt="Lock" className="w-16" />
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            OTP Verification
          </h2>

          <p className="text-base text-gray-400 mb-6">
            Enter the OTP sent to your email to verify your identity and reset
            your password.
          </p>

          <Form form={form} onFinish={handleFinish} className="space-y-4">
            {/* OTP */}
            <Form.Item
              name="otpverification"
              rules={[
                {
                  required: true,
                  message: "Please enter the OTP",
                },
              ]}
            >
              <InputOTP
                onChange={setValue}
                value={value}
                inputType="numeric"
                length={4}
                style={{
                  input: {
                    border: "2px solid #dc362e",
                    borderRadius: "4px",
                    margin: "0 5px",
                    width: "50px",
                    height: "50px",
                    fontSize: "24px",
                    textAlign: "center",
                  },
                }}
              />
            </Form.Item>

            {/* RESEND CODE */}
            <p className="text-gray-700 text-sm">
              Didn’t receive the code?
              <a
                onClick={handleResend}
                className="text-blue-500 hover:underline ml-1 cursor-pointer"
              >
                Resend
              </a>
            </p>

            {/* BUTTON VERIFY & BACK TO LOGIN */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="h-10 w-full bg-red-500 hover:bg-red-700 text-white font-medium rounded-xl focus:outline-none focus:shadow-outline mb-6"
                loading={loading}
                disabled={loading}
              >
                Verify
              </Button>
              <Button
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

export default OTPVerification;
