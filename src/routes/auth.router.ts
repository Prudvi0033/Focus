import { Hono } from "hono";
import { signUp } from "../controllers/auth.controller";

const authRouter = new Hono()

authRouter.post("/sign-up", signUp)

export default authRouter