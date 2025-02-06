import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.json({ message: "Hello Hono!" });
});

const port = 3032;
const hostname = "0.0.0.0";
console.log(`Server is running on http://${hostname}:${port}`);

serve({
  fetch: app.fetch,
  port,
  hostname,
});
