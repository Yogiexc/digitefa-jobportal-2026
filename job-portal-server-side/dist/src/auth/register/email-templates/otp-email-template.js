"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpEmailTemplate = void 0;
const otpEmailTemplate = (otp, email) => `
<!doctype html>
<html>
<head>
<meta charset="UTF-8" />
<title>OTP Verification</title>
<style>
  body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    padding: 20px;
    margin: 0;
  }
  .container {
    max-width: 600px;
    background-color: #ffffff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin: auto;
  }
  .header {
    text-align: center;
    padding-bottom: 20px;
  }
  .otp {
    text-align: center;
    font-size: 24px;
    color: #333333;
    background-color: #eeeeee;
    padding: 10px;
    border-radius: 4px;
    margin: 20px auto;
  }
  .footer {
    text-align: center;
    padding-top: 20px;
    font-size: 14px;
    color: #777777;
  }
  .preview {
    display: none;
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    color: transparent;
    height: 0;
    visibility: hidden;
  }
</style>
</head>
<body>
<div class="preview">
    Hi ${email}, You are receiving this email because you requested to verify your email address. Please use the following code to verify your email address. Your OTP code is: ${otp}. This code is valid for 15 minutes only. Please do not share this code with anyone. If you did not request this verification, please ignore this email.
  </div>
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table class="container" cellpadding="0" cellspacing="0">
          <tr>
            <td class="header">
              <h2>Digitefa OTP Verification</h2>
            </td>
          </tr>
          <tr>
            <td>
              Hi ${email},<br>
              You are receiving this email because you requested to verify your email address.<br>
              Please use the following code to verify your email address.<br>
              Your OTP code is:<br>
              <div class="otp"><strong>${otp}</strong></div>
              This code is valid for 15 minutes only. Please do not share this code with anyone.<br>
              If you did not request this verification, please ignore this email.<br>
            </td>
          </tr>
          <tr>
            <td class="footer">
              <p>Thank you, <br> The Digitefa Team</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
exports.otpEmailTemplate = otpEmailTemplate;
//# sourceMappingURL=otp-email-template.js.map