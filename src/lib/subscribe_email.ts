import Nodemailer from "nodemailer";

interface VerificationEmailParams {
  email: string;
  confirmationToken: string;
}

export async function sendVerificationEmail({ email, confirmationToken }: VerificationEmailParams) {

    const transport = Nodemailer.createTransport({
        host: "live.smtp.mailtrap.io",
        port: 587,
        auth: {
            user: "api",
            pass: process.env.MAILTRAP_API_KEY
        }
    });

    const sender = {
        address: "do-not-reply@harryfoster.tech",
        name: "Do Not Reply",
    };
    const recipients = [
        email,
    ];

    console.log("Recipient email: " + email);

    transport
        .sendMail({
            from: sender,
            to: recipients,
            subject: "Verify your email address",
            text: "Please verify your email",
            html: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Verify Your Email</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Segoe UI', Roboto, sans-serif;">
    <div style="width: 100%; padding: 40px 16px; box-sizing: border-box; text-align: center;">
      <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1); overflow: hidden; text-align: left;">
        <!-- Header -->
        <div style="background-color: #1e40af; color: white; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">harryfoster.tech</h1>
        </div>

        <!-- Content -->
        <div style="padding: 32px 24px; color: #111827;">
          <h2 style="margin-top: 0; color: #1e3a8a; font-size: 20px;">Verify Your Email</h2>
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">Hello There,</p>
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
            Thanks for signing up to <strong>harryfoster.tech</strong>! Please confirm your email address by clicking the button below:
          </p>

          <div style="text-align: center; margin: 24px 0;">
            <a href="https://www.harryfoster.tech/verify?id=${confirmationToken}" target="_blank" rel="noopener noreferrer"
              style="display: inline-block; background-color: #3b82f6; color: white; text-decoration: none; padding: 14px 24px; border-radius: 8px; font-size: 16px; font-weight: 600;">
              Verify Email
            </a>
          </div>

          <p style="font-size: 14px; line-height: 1.5; color: #6b7280;">
            If you didn’t request this, you can safely ignore this message.
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; color: #6b7280; font-size: 12px; padding: 16px; text-align: center;">
          Harry Foster • <a href="https://harryfoster.tech" style="color: #3b82f6; text-decoration: none;">harryfoster.tech</a>
        </div>
      </div>
    </div>
  </body>
</html>
`
        })
        .then(console.log, console.error);
}
