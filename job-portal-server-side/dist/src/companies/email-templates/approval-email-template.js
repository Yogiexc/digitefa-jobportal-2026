"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.approvalEmailTemplate = void 0;
const approvalEmailTemplate = (email, status, notes) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Status Update</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f6f9fc;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        .header {
            background-color: #ffffff;
            padding: 30px 20px;
            text-align: center;
            border-bottom: 1px solid #f0f0f0;
        }
        .logo {
            font-size: 28px;
            font-weight: 800;
            letter-spacing: -1px;
        }
        .logo-digi { color: #1890ff; }
        .logo-tefa { color: #06A73B; }
        .content {
            padding: 40px 30px;
        }
        .status-badge {
            display: inline-block;
            padding: 6px 16px;
            border-radius: 20px;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 14px;
            margin-bottom: 20px;
        }
        .status-accepted {
            background-color: #e6f7ff;
            color: #1890ff;
        }
        .status-rejected {
            background-color: #fff1f0;
            color: #f5222d;
        }
        .welcome-text {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 10px;
            color: #1a1a1a;
        }
        .note-container {
            background-color: #fafafa;
            border-left: 4px solid #1890ff;
            padding: 20px;
            margin: 20px 0;
            font-style: italic;
            color: #555;
        }
        .footer {
            background-color: #fafafa;
            padding: 24px;
            text-align: center;
            font-size: 13px;
            color: #999;
            border-top: 1px solid #f0f0f0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <span class="logo-digi">DIGI</span><span class="logo-tefa">TEFA</span>
            </div>
        </div>
        <div class="content">
            <div class="status-badge status-${status}">${status}</div>
            <div class="welcome-text">Account Registration Update</div>
            <p>Hi <strong>${email}</strong>,<br>We have reviewed your registration request for the Digitefa Job Portal. Your account status has been updated to: <strong>${status}</strong>.</p>
            
            ${notes ? `
            <div class="note-container">
                <strong>Admin's Note:</strong><br>
                "${notes}"
            </div>
            ` : ''}

            <p>If your account was accepted, you can now log in and start using our platform. If you have any questions, feel free to reply to this email.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Digitefa Job Portal. All rights reserved.</p>
            <p>Connecting talent with opportunity.</p>
        </div>
    </div>
</body>
</html>
`;
exports.approvalEmailTemplate = approvalEmailTemplate;
//# sourceMappingURL=approval-email-template.js.map