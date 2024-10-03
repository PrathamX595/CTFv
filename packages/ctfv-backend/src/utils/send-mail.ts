import { Context } from "hono";
import jwt from "hono/jwt";
import nodemailer from "nodemailer";

const getTransporter = (c: Context) => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: c.env.GMAIL_USER,
      pass: c.env.GMAIL_PASSWORD,
    },
  });
};

export const sendVerificationEmail = async (
  c: Context,
  email: string,
  userId: string,
) => {
  const token = await jwt.sign(
    { id: userId, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 }, // 24 hours
    c.env.JWT_SECRET,
  );
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const transporter = getTransporter(c);
  await transporter.sendMail({
    from: c.env.GMAIL_USER,
    to: email,
    subject: "Verify your email",
    text: `Click on the following link to verify your email: ${verificationLink}`,
  });

  return true;
};
