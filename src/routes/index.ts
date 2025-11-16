import { Hono } from "hono";
import authRouter from "./auth.router";

const rootRouter = new Hono()

rootRouter.route("/auth", authRouter)

export default rootRouter