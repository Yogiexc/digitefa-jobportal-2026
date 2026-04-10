import { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, App } from "antd";
import { InputOTP } from "antd-input-otp";
import Api from "../../services/Api";
import LockIcon from "../../assets/svg/Lock.svg";
import { useUserContext } from "../../UserContext";

const VerificationAccount = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [value, setValue] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setUserData } = useUserContext();
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  useEffect(() => {
    if (!location.state?.email) {
      navigate("/register");
    }
  }, []);

  const handleFinish = async (otp) => {
    const email = location.state?.email;

    if (!email) {
      message.error("Email not provided. Please register again.");
      return;
    }

    const otpku = otp?.otpverification.join("");

    try {
      setLoading(true);
      const response = await Api.post("/auth/register/verify-otp", {
        email: email,
        otp: otpku,
      });

      console.log(response.status);
      const { data } = response;
      const expiration = new Date();
      expiration.setDate(expiration.getDate() + 1);
      const tokenData = {
        value: data.token,
        expiresAt: expiration.getTime(),
      };
      const userData = {
        id: data.user.job_seeker_id || data.user.admin_id,
        name: data.user.full_name,
        email: data.user.email || email,
        role: data.user.role,
        expiresAt: expiration.getTime(),
      };

      localStorage.setItem("token", JSON.stringify(tokenData));
      localStorage.setItem("userData", JSON.stringify(userData));
      setUserData(userData);
      message.success("Email verified successfully. You are now logged in.");
      navigate("/verification-successfully", {
        state: { ...state, userData: state.userData },
      });
    } catch (error) {
      console.error("Verification failed:", error);
      const statusCode = error?.response?.data?.statusCode || error?.data?.statusCode;
      if (statusCode === 401 || statusCode === 400) {
        message.error("Verification failed! OTP is incorrect or expired.");
      } else {
        message.error(error?.response?.data?.message || error?.data?.message || "Verification failed. Please try again.");
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

  return (
    <HelmetProvider>
      <Helmet>
        <title>OTP Verification Account - Digitefa </title>
        <meta name="description" content="Digitefa" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/digitefa.svg" />
      </Helmet>

      <div className="flex min-h-screen items-center justify-center bg-gray-100 py-10">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
          <div className="flex justify-center mb-6">
            <img src={LockIcon} alt="Lock" className="w-16" />
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            OTP Verification
          </h2>

          <p className="text-base text-gray-400 mb-6">
            Enter the OTP sent to your email to verify your identity and your
            account
          </p>

          <Form form={form} onFinish={handleFinish} className="space-y-4">
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

            <p className="text-gray-700 text-sm">
              Didn’t receive the code?
              <a
                onClick={handleResend}
                className="text-blue-500 hover:underline ml-1 cursor-pointer"
              >
                Resend
              </a>
            </p>

            <Form.Item>
              <Button
                type="submit"
                htmlType="submit"
                className="h-10 w-full bg-green-500 hover:bg-green-700 text-white font-medium py-1 px-4 rounded-xl focus:outline-none focus:shadow-outline mb-6"
                loading={loading}
                disabled={loading}
              >
                Verify
              </Button>
              <Link to="/register">
                <Button className="h-10 w-full bg-white text-black border border-gray-400 font-medium rounded-xl focus:outline-none focus:shadow-outline  hover:text-green hover:border-green-500">
                  Back to Register
                </Button>
              </Link>
            </Form.Item>
          </Form>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default VerificationAccount;
