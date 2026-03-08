export const otpEmailTemplate = (otp: string, email: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset OTP</title>
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
        .welcome-text {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 10px;
            color: #1a1a1a;
        }
        .instruction {
            color: #666;
            margin-bottom: 30px;
        }
        .otp-container {
            background-color: #f0f7ff;
            border: 2px dashed #1890ff;
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
        }
        .otp-code {
            font-size: 42px;
            font-weight: 800;
            letter-spacing: 8px;
            color: #1890ff;
            margin: 0;
        }
        .otp-label {
            font-size: 13px;
            color: #1890ff;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 10px;
            font-weight: 600;
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
            <div class="welcome-text">Password Reset Request</div>
            <p class="instruction">Hi <strong>${email}</strong>,<br>We received a request to reset your password. Please use the following One-Time Password (OTP) to proceed. If you didn't request this, you can safely ignore this email.</p>
            
            <div class="otp-container">
                <div class="otp-label">Reset Code</div>
                <div class="otp-code">${otp}</div>
            </div>

            <p class="instruction">This code is valid for <strong>15 minutes</strong>. For security reasons, please do not share this code with anyone.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Digitefa Job Portal. All rights reserved.</p>
            <p>Your security is our top priority.</p>
        </div>
    </div>
</body>
</html>
`;
