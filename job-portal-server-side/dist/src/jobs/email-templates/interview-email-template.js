"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interviewEmailTemplate = void 0;
const interviewEmailTemplate = (jobseekerName, jobTitle, companyName, interviewDate, meetingLink, notes) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interview Invitation</title>
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
        .details-container {
            background-color: #f0f7ff;
            border: 2px dashed #1890ff;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
        }
        .details-container ul {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }
        .details-container li {
            margin-bottom: 10px;
            color: #333;
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
            <p class="instruction" style="font-weight: 600;">Congratulations!</p>
            <p class="instruction">We are pleased to inform you that you have been shortlisted for an interview for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.</p>
            
            <p class="instruction">Please find the details of your interview below:</p>
            
            <div class="details-container">
                <ul>
                    <li><strong>Interview Date:</strong> ${interviewDate}</li>
                    <li><strong>Meeting Link/Location:</strong> ${meetingLink}</li>
                    <li><strong>Notes:</strong> ${notes}</li>
                </ul>
            </div>

            <p class="instruction">Kindly make sure to join the meeting on time. Should you have any questions or require further information, please do not hesitate to contact us.</p>
            <p class="instruction">We look forward to speaking with you.</p>

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
exports.interviewEmailTemplate = interviewEmailTemplate;
//# sourceMappingURL=interview-email-template.js.map