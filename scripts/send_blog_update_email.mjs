import nodemailer from "nodemailer";
import fs from "fs";

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

const content = fs.readFileSync(filePath, "utf-8");
const subject = `New Blog Post: ${filePath.split("/").pop()}`;

// extract and parse markdown properties

for (const email of users) {
  await transporter.sendMail({
    from: '"Blog Notifier" <no-reply@harryfoster.tech>',
    to: email,
    subject,
    html: `<h1>New Post Published</h1><p>${content}</p>`,
  });
  console.log(`Sent email to ${email}`);
}
