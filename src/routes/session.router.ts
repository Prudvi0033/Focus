import { Hono } from "hono";
import { createSession, endSession } from "../controllers/session.controller";
import { authMiddleware } from "../lib/middleware";

const sessionRouter = new Hono();

sessionRouter.use(authMiddleware);

sessionRouter.post("/create", createSession);

sessionRouter.put("/end/:id", endSession);

export default sessionRouter;
