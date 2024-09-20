import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import {  Hono } from "hono";
import { JwtVariables, sign } from "hono/jwt";

type Variables = JwtVariables;
import { Bindings } from "../../env";
import * as schema from "../db/schema";

import { authMiddleware } from "../middlewares/auth";
import { adminMiddleware } from "../middlewares/admin";

import { getDB } from "..";

const challengesRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();

challengesRouter.get('/', (c) => {
    return c.json({
        msg:"working"
    })
})

export default challengesRouter;

