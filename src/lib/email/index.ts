import nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/sendmail-transport";
import { CONSTANT } from "@/constants/constant";
import { envPromise } from "../env";
import { mUser } from "@/repo/mUser";
import { xNoThrowFn } from "../xNoThrow";
import { generateHTML } from "./verifyYourEmail";

export const emailPromise = (async function () {
    const env = (await envPromise).ret;

    const transporter = nodemailer.createTransport({
        auth: {
            user: env.SMTP_EMAIL,
            pass: env.SMTP_PASSWORD,
        },
        host: env.SMTP_HOST,
    });

    const appName = CONSTANT.appInfo.fullName;
    const from = `${appName} <${env.SMTP_EMAIL}>`;

    return xNoThrowFn.ret({
        async sendVfEmail(user: mUser, vfToken: string, expirySeconds: number) {
            const verificationURL = `${env.APP_URL}/verifyEmail?vfToken=${vfToken}`;

            const emailOptions: MailOptions = {
                from,
                to: user.email,
                subject: `Verify Your Email - ${appName} 😃`,
                html: generateHTML(appName, verificationURL, user, expirySeconds),
            };

            try {
                await transporter.sendMail(emailOptions);
                return xNoThrowFn.ret();
            } catch (err) {
                console.error(`Error sending email to \"${user.email}\":`, err);
                return xNoThrowFn.err(err);
            }
        },
    });
})();
