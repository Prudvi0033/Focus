import { Hono } from "hono";
import authRouter from "./auth.router";
import sessionRouter from "./session.router";
import dashboardRouter from "./dashboard.rotue";

const rootRouter = new Hono()

rootRouter.route("/auth", authRouter)
rootRouter.route("/session", sessionRouter)
rootRouter.route("/dashboard", dashboardRouter)

export default rootRouter