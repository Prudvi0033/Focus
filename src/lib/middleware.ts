import type { Context, Next } from "hono";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../services/constants";

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ error: true, msg: "Missing or invalid token format" }, 401);
    }

    const token = authHeader.split(" ")[1]!

    const decoded = jwt.verify(token, JWT_SECRET as string);

    c.set("user", decoded);

    await next();
  } catch (error) {
    return c.json({ error: true, msg: "Invalid or expired token" }, 401);
  }
};
