import { Hono } from "hono";
import { PORT } from "../services/constants";
import rootRouter from "./routes";

const app = new Hono()

app.get("/", (c) => 
    c.text("Testing")
)

app.route("/api", rootRouter)

Bun.serve({
    port: PORT,
    fetch: app.fetch
})

console.log("App is listening", PORT);


