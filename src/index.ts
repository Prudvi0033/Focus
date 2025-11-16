import { Hono } from "hono";
import { PORT } from "../services/constants";

const app = new Hono()

app.get("/", (c) => 
    c.text("Testing")
)

Bun.serve({
    port: PORT,
    fetch: app.fetch
})

console.log("App is listening", PORT);


