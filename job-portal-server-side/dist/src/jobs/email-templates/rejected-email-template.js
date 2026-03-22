"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectedEmailTemplate = void 0;
const rejectedEmailTemplate = (jobseekerName, jobTitle, companyName) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Update</title>
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
            display: inline-block;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 20px;
            color: #1a1a1a;
        }
        .instruction {
            color: #666;
            margin-bottom: 20px;
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
                <img src="cid:digitefa-logo" alt="Digitefa Logo" style="max-height: 48px; width: auto;" />
            </div>
        </div>
        <div class="content">
            <div class="greeting">Dear ${jobseekerName},</div>
            <p class="instruction">Thank you for your application for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.</p>
            
            <p class="instruction">After careful review, we regret to inform you that your application has <span style="font-weight: 600; color: #E74C3C;">not been selected</span> to proceed to the next stage of the recruitment process.</p>

            <p class="instruction">We appreciate your interest in <strong>${companyName}</strong> and wish you success in your future endeavors.</p>

            <p class="instruction" style="margin-top: 30px;">Best regards,<br><strong>${companyName} Recruitment Team</strong></p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Digitefa Job Portal. All rights reserved.</p>
            <p>Empowering your future, one step at a time.</p>
        </div>
    </div>
</body>
</html>
`;
exports.rejectedEmailTemplate = rejectedEmailTemplate;
//# sourceMappingURL=rejected-email-template.js.map