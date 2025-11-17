import { Hono } from "hono";
import authRouter from "./auth.router";
import sessionRouter from "./session.router";

const rootRouter = new Hono()

rootRouter.route("/auth", authRouter)
rootRouter.route("/session", sessionRouter)

export default rootRouter