import nodemailer from "nodemailer";

export const createMailTransporter = () => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, //email address
      pass: process.env.EMAIL_PASS //app password
    }
  });

  return transporter;
};
