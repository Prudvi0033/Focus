import { Hono } from "hono";
import { getInfo, getStreak } from "../controllers/dashboard.controller";

const dashboardRouter = new Hono()

dashboardRouter.get("/", getInfo)
dashboardRouter.get("/get-streak", getStreak)

export default dashboardRouter