export const approvalNotificationEmailTemplate = (name: string, title: string, message: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
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
        .content {
            padding: 40px 30px;
        }
        .welcome-text {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 10px;
            color: #1a1a1a;
            text-align: center;
        }
        .instruction {
            color: #666;
            margin-bottom: 15px;
        }
        .status-container {
            background-color: #f0fff4;
            border: 2px dashed #06A73B;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
        }
        .status-text {
            font-size: 24px;
            font-weight: 700;
            color: #06A73B;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .footer {
            background-color: #fafafa;
            padding: 24px;
            text-align: center;
            font-size: 13px;
            color: #999;
            border-top: 1px solid #f0f0f0;
        }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background-color: #1890ff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin-top: 20px;
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
            <div class="welcome-text">${title}</div>
            <p class="instruction">Hi <strong>${name}</strong>,</p>
            <p class="instruction">${message}</p>
            
            <div class="status-container">
                <div class="status-text">Approved ✅</div>
            </div>

            <p class="instruction">You can now access your dashboard and explore all features. Click the button below to get started.</p>
            
            <div style="text-align: center;">
                <a href="#" class="btn">Login to Dashboard</a>
            </div>
        </div>
        <div class="footer">
            <p>&copy; 2024 Digitefa Job Portal. All rights reserved.</p>
            <p>Empowering your future, one step at a time.</p>
        </div>
    </div>
</body>
</html>
`;
