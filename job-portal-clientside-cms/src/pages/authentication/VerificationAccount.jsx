import { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button, message } from "antd";
import { InputOTP } from "antd-input-otp";
import Api from "../../services/Api";
import SuccessfullyIcon from "../../assets/svg/Successfully.svg";

const VerificationAccount = () => {
  const [form] = Form.useForm();
  const [value, setValue] = useState([]);
  const [loading, setLoading] = useState(false);
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
      message.destroy();
      message.error("Email not provided. Please register again.");
      return;
    }

    const otpku = otp?.otpverification.join("");

    try {
      setLoading(true);
      await Api.post("/auth/register/verify-otp", {
        email: email,
        otp: otpku,
      })
        .then((response) => {
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
                role: data.user.role,
                expiresAt: expiration.getTime(),
              };
              break;
            case "university":
              userData = {
                id: data.user.university_id,
                name: data.user.university_name,
                role: data.user.role,
                status: data.user.status,
                expiresAt: expiration.getTime(),
              };
              break;
            case "company":
              userData = {
                id: data.user.company_id,
                name: data.user.legal_name,
                role: data.user.role,
                status: data.user.status,
                expiresAt: expiration.getTime(),
              };
              break;
            default:
              throw new Error(`Unknown role: ${data.user.role}`);
          }
          sessionStorage.setItem("token", JSON.stringify(tokenData));
          sessionStorage.setItem("userData", JSON.stringify(userData));
          message.destroy();
          message.success(
            "Email verified successfully. Please login to continue."
          );
          if (data.user.role === "university") {
            navigate("/verification-successfully-university", { state: { ...state, userData } });
          } else if (data.user.role === "company") {
            navigate("/verification-successfully-company", { state: { ...state, userData } });
          } else {
            navigate("/verification-successfully", { state: { ...state, userData } });
          }
        })
        .catch((error) => {
          if (error.status === 400) {
            message.destroy();
            message.error("Invalid or expired OTP");
          }
        });
    } catch (error) {
      console.error("Verification failed:", error);
      if (error.response && error.response.data) {
        message.error(
          error.response.data.message ||
            "Verification failed. Please try again."
        );
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
      message.success("OTP has been resend to your email.");
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
        <title>OTP Verification Account - CMS DIGITEFA </title>
        <meta name="description" content="DIGITEFA" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.svg" />
      </Helmet>

      <div className="flex min-h-screen items-center justify-center bg-gray-100 py-10">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
          <div className="flex justify-center mb-6">
            <img src={SuccessfullyIcon} alt="Lock" className="w-16" />
          </div>

          <h2 className="text-xl font-semibold mb-4">
            OTP Verification
          </h2>

          <p className="text-base text-[#9A9A9A] mb-6">
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
            
            <p className="text-[#9A9A9A] text-xs">
              Didn’t receive the code?
              <a
                onClick={handleResend}
                className="text-[#0553BA] hover:underline ml-1 cursor-pointer"
              >
                Resend
              </a>
            </p>

            <Form.Item>
              <Button
                type="submit"
                htmlType="submit"
                className="h-10 w-full bg-red-500 hover:bg-red-700 text-white font-medium rounded-xl focus:outline-none focus:shadow-outline mb-6"
                loading={loading}
                disabled={loading}
              >
                Verify
              </Button>
              <Button
                className="h-10 w-full bg-transparent text-red-500 border border-red-500 font-medium rounded-xl focus:outline-none focus:shadow-outline"
                href="/register"
              >
                Back to Register
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default VerificationAccount;
