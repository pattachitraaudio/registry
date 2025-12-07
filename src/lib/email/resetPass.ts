import { mUser } from "@/repo/mUser";

export const generateHTML = function (appName: string, resetURL: string, user: mUser, expirySeconds: number) {
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #171717;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background-color: #f5f5f5;
            padding: 30px;
            border-radius: 0 0 8px 8px;
        }
        .button {
            display: inline-block;
            background-color: #171717;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
        }
        .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 12px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Request</h1>
        </div>
        <div class="content">
            <p>Hi ${user.name},</p>
            <p>We received a request to reset your password for your ${appName} account.</p>
            <p>Click the button below to reset your password:</p>
            <center>
                <a href="${resetURL}" class="button">Reset Password</a>
            </center>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${resetURL}</p>
            <p><strong>This link will expire in ${expirySeconds} seconds.</strong></p>
            <div class="warning">
                <strong>⚠️ Security Notice:</strong> If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
            </div>
            <p>For your security, never share this link with anyone.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
};
