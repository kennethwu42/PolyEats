import { createMailTransporter } from "./createMailTransporter.js";

export const sendVerificationMail = (user) => {
  const transporter = createMailTransporter();

  const mailOptions = {
    from: "Poly Eats <polyeats1901@gmail.com>", //sender email
    to: user.email,
    subject: "Verify your email...",
    html: `
      <p>Hello 👋 ${user.name},</p>
      <p>Please verify your email by clicking the link below:</p>
      <a href='${process.env.CLIENT_URL}/auth/verify-email?token=${user.emailToken}'>Verify Your Email</a>
      <p>If you did not request this, please ignore this email.</p>
    `
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
        reject(error);
      } else {
        console.log("Verification email sent:", info.response);
        resolve(info.response);
      }
    });
  });
};
