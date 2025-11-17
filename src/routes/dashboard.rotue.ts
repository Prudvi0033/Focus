import { Hono } from "hono";
import { getInfo, getStreak } from "../controllers/dashboard.controller";
import { authMiddleware } from "../lib/middleware";

const dashboardRouter = new Hono()

dashboardRouter.use(authMiddleware)

dashboardRouter.get("/", getInfo)
dashboardRouter.get("/get-streak", getStreak)

export default dashboardRouter