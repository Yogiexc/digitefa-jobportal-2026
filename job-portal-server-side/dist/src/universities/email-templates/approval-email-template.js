"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.approvalEmailTemplate = void 0;
const approvalEmailTemplate = (email, status, notes) => `
<!doctype html>
<html>
<head>
<meta charset="UTF-8" />
<title>Approval Notification</title>
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
  .status {
    text-align: center;
    font-size: 24px;
    color: ${status === 'accepted' ? '#28a745' : '#dc3545'};
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
  .admin-note {
    margin: 20px 0;
    padding: 10px;
    background-color: #f9f9f9;
    border-left: 4px solid #ccc;
  }
</style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table class="container" cellpadding="0" cellspacing="0">
          <tr>
            <td class="header">
              <h2>Approval Notification</h2>
            </td>
          </tr>
          <tr>
            <td>
              Hi ${email},<br>
              Your request has been <strong>${status}</strong>.<br>
              <div class="status"><strong>${status}</strong></div>
              <div class="admin-note">
                <strong>Note from Admin:</strong><br>
                ${notes}
              </div>
              If you have any questions, please contact our support team.<br>
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
exports.approvalEmailTemplate = approvalEmailTemplate;
//# sourceMappingURL=approval-email-template.js.map