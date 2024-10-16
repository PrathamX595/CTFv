import { Context } from "hono";
import { JwtVariables, sign, verify } from "hono/jwt";

import { getDB } from "..";

const MAILGUN_API_URL = "https://api.mailgun.net/v3";

export const sendVerificationEmail = async (
  c: Context,
  email: string,
  userId: string,
) => {
  const frontendURL = c.env.FRONTEND_URL || "http://localhost:5173";
  const token = await sign(
    { id: userId, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 },
    c.env.AUTH_SECRET,
  );
  // const verificationLink = `${c.env.FRONTEND_URL}/verify-email?token=${token}`;
  const verificationLink = `${frontendURL}/verify-email?token=${token}`;

  const formData = new FormData();
  formData.append(
    "from",
    `CTFv Verification, Cybersec IIT (BHU) <noreply@${c.env.MAILGUN_DOMAIN}>`,
  );
  formData.append("to", email);
  formData.append("subject", "Verify your email for CTFv");
  formData.append(
    "text",
    `Click on the following link to verify your email: ${verificationLink}`,
  );

  const response = await fetch(
    `${MAILGUN_API_URL}/${c.env.MAILGUN_DOMAIN}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa("api:" + c.env.MAILGUN_API_KEY),
      },
      body: formData,
    },
  );

  console.log(response);

  if (!response.ok) {
    const errorData: any = await response.json();
    throw new Error(`Failed to send email: ${errorData.message}`);
  }

  return true;
};
