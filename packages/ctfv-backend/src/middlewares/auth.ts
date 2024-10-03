import { Context, MiddlewareHandler } from "hono";
import { JwtVariables, verify } from "hono/jwt";

import { Bindings } from "../../env";

type Variables = JwtVariables;

export const authMiddleware: MiddlewareHandler<{
  Bindings: Bindings;
  Variables: Variables;
}> = async (c: Context, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = await verify(token, c.env.AUTH_SECRET);

    if (payload.emailVerified === false) {
      return c.json({ error: "Email not verified" }, 401);
    }

    c.set("jwtPayload", payload);
    await next();
  } catch (error) {
    return c.json({ error: "Invalid token" }, 401);
  }
};
