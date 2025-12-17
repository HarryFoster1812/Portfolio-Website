import nodemailer from "nodemailer";
import fs from "fs";
import matter from "gray-matter"

const [filePath, usersJson] = process.argv.slice(2);
if (!filePath || !usersJson) {
  console.error("Usage: node send-email.js <filePath> <usersJson>");
  process.exit(1);
}

const users = JSON.parse(usersJson);

// Nodemailer setup (Mailtrap)

const transporter = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: "api",
    pass: process.env.MAILTRAP_API_KEY,
  },
});

const filename = filePath.split('/').pop().replace('.md', '');
const fileContent = fs.readFileSync(filePath, "utf-8");

// extract and parse markdown properties

const { data, content } = matter(fileContent)

const title = data.title || content.match(/^#\s+(.*)/m)?.[1] || "No title"
const description = data.description || "No description"

const subject = `New Blog Post: ${title}`;

for (const user of users) {
  await transporter.sendMail({
    from: '"Blog Notifier" <no-reply@harryfoster.tech>',
    to: user.email,
    subject,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | The Cache Hit</title>
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
      background: #2dd4bf; /* teal */
      color: #042f2e !important;
      padding: 14px 22px;
      border-radius: 8px;
      font-weight: bold;
      display: inline-block;
      margin: 14px 0;
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
              <p>Hello there!</p>

              <p>
                A new post just landed on
                <a href="https://harryfoster.tech/blog">The Cache Hit</a>.
              </p>

              <h2>${title}</h2>

              <p>${description}</p>

              <p style="text-align:center;">
                <a
                  href="https://harryfoster.tech/blog/${filename}"
                  class="btn"
                >
                  Read the full post →
                </a>
              </p>

              <p>
                Thanks for reading,<br />
                Harry
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer">
              <p>
                You're receiving this because you subscribed to
                <a href="https://harryfoster.tech/blog">The Cache Hit · harryfoster.tech</a>.
              </p>
              <p>
                <a href="https://harryfoster.tech/unsubscribe/${user.confirmationToken}">
                  Unsubscribe
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
  });
}
