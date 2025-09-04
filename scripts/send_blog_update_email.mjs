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
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} | Blog Update</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      color: #333;
      margin: 0;
      padding: 0;
      background: #f9f9f9;
    }
    a {
      color: #2563eb;
      text-decoration: none;
    }
    .container {
      max-width: 600px;
      width: 100%;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      overflow: hidden;
    }
    .header {
      border-bottom: 1px solid #eee;
      padding: 20px;
      text-align: center;
    }
    .header h2 {
      margin: 0;
      color: #111;
      font-size: 24px;
    }
    .content {
      padding: 20px;
    }
    .content h3 {
      color: #2563eb;
      margin: 16px 0;
      font-size: 20px;
    }
    .content p {
      font-size: 16px;
      line-height: 1.6;
      margin: 0 0 16px;
    }
    .btn {
      background: #2563eb;
      color: #fff !important;
      text-decoration: none;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: bold;
      display: inline-block;
    }
    .footer {
      font-size: 13px;
      color: #888;
      border-top: 1px solid #eee;
      text-align: center;
      padding: 15px;
    }
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
        border-radius: 0 !important;
      }
      .content {
        padding: 15px !important;
      }
      .header h2 {
        font-size: 20px !important;
      }
      .content h3 {
        font-size: 18px !important;
      }
      .content p {
        font-size: 15px !important;
      }
      .btn {
        display: block !important;
        width: 100% !important;
        box-sizing: border-box !important;
        text-align: center !important;
      }
    }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin:0; padding:20px 0;">
    <tr>
      <td align="center">
        <table class="container" cellpadding="0" cellspacing="0">
          <!-- Header -->
          <tr>
            <td class="header">
              <h2>Harry Foster | Blog Update</h2>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td class="content">
              <p>Hello &#128075;,</p>
              <p>I’ve just published a new blog post on 
                <a href="https://harryfoster.tech">harryfoster.tech</a>. I thought you might enjoy it:</p>
              
              <h3>${title}</h3>
              
              <p>${description}</p>
              
              <p style="text-align:center;">
                <a href="https://www.harryfoster.tech/blog/${filename}" class="btn">Read the full post →</a>
              </p>
              
              <p>Thanks for following along,<br>Harry</p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td class="footer">
              <p>You’re receiving this email because you subscribed to updates on 
                <a href="https://harryfoster.tech">harryfoster.tech</a>.
              </p>
              <p>
                <a href="https://www.harryfoster.tech/Unsubscribe/${user.confirmationToken}">Unsubscribe</a>
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
