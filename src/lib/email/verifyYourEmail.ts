import { mUser } from "@/repo/mUser";

export const generateHTML = function (appName: string, verificationURL: string, user: mUser, expirySeconds: number) {
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
            <h1>Welcome to ${appName}!</h1>
        </div>
        <div class="content">
            <p>Hi ${user.name},</p>
            <p>Thank you for signing up! Please verify your email address to complete your registration.</p>
            <p>Click the button below to verify your email:</p>
            <center>
                <a href="${verificationURL}" class="button">Verify email</a>
            </center>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${verificationURL}</p>
            <p><strong>This link will expire in ${expirySeconds} seconds.</strong></p>
            <p>If you didn't create an account \`${appName}\`, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
        `;
};
