/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer";
import path from "path";
import ejs from "ejs";
import { envVars } from "../../config/env";
import ApiError from "../../errors/ApiError";
import { StatusCodes } from "http-status-codes";

const transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
  secure: true,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS,
  },
});

interface sendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData?: Record<string, any>;
  attachments?: {
    fileName: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: sendEmailOptions) => {
  try {
    const templatePath = path.join(__dirname, `templates/${templateName}.ejs`);

    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to: to,
      subject: subject,
      html: html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.fileName,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });

    console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`);
  } catch (error: any) {
    console.log("Email sending error ", error.message);
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Email error");
  }
};
