import { Hono } from "hono";
import { authMiddleware } from "../lib/middleware";
import { weeklyReport } from "../controllers/weekly.controller";

const weekRouter = new Hono()

weekRouter.use(authMiddleware)

weekRouter.get("/", weeklyReport)

export default weekRouter;