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
        name: "Harry Foster",
    };
    const recipients = [
        email,
    ];

    console.log("Recipient email: " + email);

    await transport
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
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification | The Cache Hit</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background: #0a0a0a; /* black */
      color: #e5e7eb; /* zinc-200 */
    }
    a {
      color: #2dd4bf; /* teal */
      text-decoration: none;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background: #0f0f0f; /* near-black */
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0,0,0,0.6);
      border: 1px solid #27272a; /* zinc-800 */
    }
    .header {
      background: #0a0a0a;
      border-bottom: 1px solid #27272a;
      text-align: center;
      padding: 28px 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 26px;
      color: #ffffff;
    }
    .header p {
      margin: 6px 0 0;
      font-size: 14px;
      color: #a1a1aa; /* zinc-400 */
      letter-spacing: 0.5px;
    }
    .content {
      padding: 22px;
    }
    .content h2 {
      color: #ffffff;
      font-size: 22px;
      margin: 0 0 12px;
    }
    .content p {
      font-size: 16px;
      line-height: 1.6;
      color: #d4d4d8; /* zinc-300 */
      margin: 0 0 16px;
    }
  .btn {
    background: #2dd4bf;
    color: #042f2e !important;
    padding: 14px 22px;
    border-radius: 8px;
    font-weight: bold;
    display: inline-block;
    margin: 14px 0;
    transition: transform 0.2s ease, background 0.2s ease;
  }

  .btn:hover {
    background: #34e0c1; /* slightly brighter teal */
    transform: scale(1.05);
  }

  @media only screen and (max-width: 600px) {
    .btn {
      width: 100% !important;
      text-align: center !important;
    }
  }
    .footer {
      text-align: center;
      font-size: 13px;
      color: #a1a1aa;
      border-top: 1px solid #27272a;
      padding: 16px 20px;
    }
    .footer a {
      color: #2dd4bf;
    }
    @media only screen and (max-width: 600px) {
      .header h1 {
        font-size: 22px !important;
      }
      .content h2 {
        font-size: 20px !important;
      }
      .content p {
        font-size: 15px !important;
      }
      .btn {
        width: 100% !important;
        text-align: center !important;
      }
    }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
    <tr>
      <td align="center">
        <table class="container" cellpadding="0" cellspacing="0">

          <!-- Header -->
          <tr>
            <td class="header">
              <h1>The Cache Hit</h1>
                <p>Engineering Deep Dives · harryfoster.tech</p>            
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content">
              <p>Thanks for signing up to The Cache Hit!
             <br>
             Please verify your email by clicking the button below:</p>

              <h2>Confirm Your Email</h2>

              <p style="text-align:center;">
                <a href="https://www.harryfoster.tech/verify?id=${confirmationToken}" class="btn">
                  Verify Email
                </a>
              </p>

              <p>If you didn&apos;t request this, you can safely ignore this message.</p>

              <p>Thanks again,<br />Harry Foster</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
        });
}
