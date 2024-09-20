import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { JwtVariables, sign } from "hono/jwt";

import { getDB } from "..";
import { Bindings } from "../../env";
import * as schema from "../db/schema";
import { adminMiddleware } from "../middlewares/admin";
import { authMiddleware } from "../middlewares/auth";

type Variables = JwtVariables;

const challengesRouter = new Hono<{
  Bindings: Bindings;
  Variables: Variables;
}>();

challengesRouter.get("/", (c) => {
  return c.json({
    msg: "working",
  });
});

export default challengesRouter;
