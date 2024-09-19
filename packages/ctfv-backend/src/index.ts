import { Hono, Context, MiddlewareHandler } from "hono";
import { cors } from "hono/cors";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { sign, verify, JwtVariables } from "hono/jwt";
import bcrypt from "bcryptjs";
import * as schema from "./db/schema";
import { Bindings } from "../env";
import { logger } from "hono/logger";

type Variables = JwtVariables

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>();

app.use(
  "*",
  cors({
    origin: (origin) => origin,
    credentials: true,
  })
);
app.use(logger())

const getDB = (c: Context) => drizzle(c.env.DATABASE, { schema });

export const authMiddleware: MiddlewareHandler<{Bindings:Bindings, Variables:Variables}> = async (c: Context, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = await verify(token, c.env.AUTH_SECRET);
    c.set('jwtPayload', payload);
    await next();
  } catch (error) {
    return c.json({ error: "Invalid token" }, 401);
  }
};

app.post("/api/auth/register", async (c) => {
  try {
    const db = getDB(c);
    const { email, password, username, isAdmin } = await c.req.json();
    
    if (typeof isAdmin !== 'boolean') {
      return c.json({ error: "isAdmin must be boolean" }, 400);
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });

    if (existingUser) {
      return c.json({ error: "User already exists" }, 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.insert(schema.users).values({
      email,
      password: hashedPassword,
      username,
      isAdmin
    }).returning().get();

    // Check if AUTH_SECRET is defined
    if (!c.env.AUTH_SECRET) {
      console.error("AUTH_SECRET is not defined in the environment");
      return c.json({ error: "Internal server error" }, 500);
    }

    const token = await sign({ userId: newUser.id }, c.env.AUTH_SECRET);

    return c.json({ 
      token, 
      user: { 
        id: newUser.id, 
        email: newUser.email, 
        username: newUser.username ,
        isAdmin: newUser.isAdmin
      } 
    });
  } catch (error) {
    console.error("Error in /api/auth/register:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.post("/api/auth/login", async (c) => {
  const db = getDB(c);
  const { email, password } = await c.req.json();

  const user = await db.query.users.findFirst({
    where: eq(schema.users.email, email),
  });

  if (!user || !await bcrypt.compare(password, user.password)) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const token = await sign({ userId: user.id }, c.env.AUTH_SECRET);

  return c.json({ token, user: { id: user.id, email: user.email, username: user.username } });
});

app.get("/api/users", async (c) => {
  const db = getDB(c);
  const users = await db.query.users.findMany({
    columns: {
      id: true,
      username: true,
      email: true,
      rollNo: true,
      instituteName: true,
      isAdmin: true
    },
  });
  return c.json(users);
});

// Get user profile
app.get("/api/users/:id", authMiddleware, async (c) => {
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
      isAdmin: true
    },
  });

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json(user);
});

// Update user profile
app.put("/api/users/:id", authMiddleware, async (c) => {
  const db = getDB(c);
  const userId = c.req.param("id");
  const { rollNo, instituteName } = await c.req.json();

  if (userId !== c.get('jwtPayload').userId) {
    return c.json({ error: "Unauthorized" }, 403);
  }

  const updatedUser = await db
    .update(schema.users)
    .set({ rollNo, instituteName })
    .where(eq(schema.users.id, userId))
    .returning({
      id: schema.users.id,
      username: schema.users.username,
      email: schema.users.email,
      rollNo: schema.users.rollNo,
      instituteName: schema.users.instituteName,
    });

  return c.json(updatedUser[0]);
});

export default app;