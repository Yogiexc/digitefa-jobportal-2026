export const acceptedEmailTemplate = (
  jobseekerName: string,
  jobTitle: string,
  companyName: string,
) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Accepted</title>
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
            <p class="instruction">We are pleased to inform you that your application for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong> has been <span style="font-weight: 600; color: #06A73B;">accepted</span>.</p>
            
            <p class="instruction">Our team will contact you shortly with further details regarding the next steps in the recruitment process.</p>

            <p class="instruction">Please ensure that you remain available and responsive for upcoming communications.</p>

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
