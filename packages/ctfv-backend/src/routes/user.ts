import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { JwtVariables, sign, verify } from "hono/jwt";

import { getDB } from "..";
import { Bindings } from "../../env";
import * as schema from "../db/schema";
import { authMiddleware } from "../middlewares/auth";
import { sendVerificationEmail } from "../utils/send-mail";

type Variables = JwtVariables;

const userRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();

userRouter.post("/auth/register", async (c) => {
  try {
    const db = getDB(c);
    const { email, password, username } = await c.req.json();

    const existingUser = await db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });

    if (existingUser) {
      return c.json({ error: "User already exists" }, 400);
    }

    // Ensure email ends with @itbhu.ac.in
    if (!email.endsWith("@itbhu.ac.in")) {
      return c.json(
        { error: "Email must end with @itbhu.ac.in" },
        400,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db
      .insert(schema.users)
      .values({
        email,
        password: hashedPassword,
        username,
        isAdmin: false,
      })
      .returning()
      .get();

    // Check if AUTH_SECRET is defined
    if (!c.env.AUTH_SECRET) {
      console.error("AUTH_SECRET is not defined in the environment");
      return c.json({ error: "Internal server error" }, 500);
    }

    const token = await sign(
      {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        emailVerified: newUser.emailVerified,
        isAdmin: false,
      },
      c.env.AUTH_SECRET,
    );

    return c.json({ token });
  } catch (error) {
    console.error("Error in /api/auth/register:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

userRouter.post("/auth/login", async (c) => {
  const db = getDB(c);
  const { email, password } = await c.req.json();

  const user = await db.query.users.findFirst({
    where: eq(schema.users.email, email),
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const token = await sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin,
      emailVerified: user.emailVerified,
    },
    c.env.AUTH_SECRET,
  );

  return c.json({ token });
});

userRouter.post("/auth/send-verify-email", async (c) => {
  const db = getDB(c);
  const { email } = await c.req.json();

  const user = await db.query.users.findFirst({
    where: eq(schema.users.email, email),
  });

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  if (user.emailVerified) {
    return c.json({ error: "Email already verified" }, 400);
  }

  if (
    user.lastVerificationEmailSent &&
    user.lastVerificationEmailSent.getTime() > Date.now() - 24 * 60 * 60 * 1000
  ) {
    return c.json({ error: "Email already sent, wait 24 hours!" }, 400);
  }

  const emailSent = await sendVerificationEmail(c, user.email, user.id);

  if (emailSent) {
    await db
      .update(schema.users)
      .set({ lastVerificationEmailSent: new Date() })
      .where(eq(schema.users.id, user.id))
      .run();
    return c.json({ message: "Verification email sent" });
  }

  return c.json({ error: "Failed to send verification email" }, 500);
});

userRouter.get("/auth/verify-email", async (c) => {
  const db = getDB(c);
  const emailToken = c.req.query("token") as string;
  try {
    const decoded = (await verify(emailToken, c.env.AUTH_SECRET)) as {
      id: string;
    };

    const updatedUser = await db
      .update(schema.users)
      .set({ emailVerified: true })
      .where(eq(schema.users.id, decoded.id))
      .returning({
        id: schema.users.id,
        isAdmin: schema.users.isAdmin,
        emailVerified: schema.users.emailVerified,
      });

    const token = await sign(
      {
        userId: updatedUser[0].id,
        isAdmin: updatedUser[0].isAdmin,
        emailVerified: updatedUser[0].emailVerified,
      },
      c.env.AUTH_SECRET,
    );

    return c.json({ message: "Email verified successfully!", token });
  } catch (err) {
    return c.json({ error: "Invalid or expired token." }, 400);
  }
});

userRouter.get("/", async (c) => {
  const db = getDB(c);
  const users = await db.query.users.findMany({
    columns: {
      id: true,
      username: true,
      email: true,
      rollNo: true,
      instituteName: true,
      website: true,
      affiliation: true,
      country: true,
      isAdmin: true,
    },
  });
  return c.json(users);
});

// Get user profile
userRouter.get("/:id", authMiddleware, async (c) => {
  const db = getDB(c);
  const userId = c.req.param("id");
  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, userId),
    columns: {
      id: true,
      username: true,
      email: true,
      rollNo: true,
      instituteName: true,
      website: true,
      affiliation: true,
      country: true,
      isAdmin: true,
    },
  });

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json(user);
});

// Update user profile
userRouter.put("/:id", authMiddleware, async (c) => {
  const db = getDB(c);
  const userId = c.req.param("id");
  const { rollNo, instituteName, website, affiliation, country } =
    await c.req.json();

  if (userId !== c.get("jwtPayload").userId) {
    return c.json({ error: "Unauthorized" }, 403);
  }

  const updatedUser = await db
    .update(schema.users)
    .set({ rollNo, instituteName, website, affiliation, country })
    .where(eq(schema.users.id, userId))
    .returning({
      id: schema.users.id,
      username: schema.users.username,
      email: schema.users.email,
      rollNo: schema.users.rollNo,
      instituteName: schema.users.instituteName,
      website: schema.users.website,
      affiliation: schema.users.affiliation,
      country: schema.users.country,
    });

  return c.json(updatedUser[0]);
});

export default userRouter;
