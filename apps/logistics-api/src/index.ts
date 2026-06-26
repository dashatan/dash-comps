import { serve } from "@hono/node-server";
import { app } from "./app";
import { ensureSeeded } from "./db";

ensureSeeded();

const port = Number(process.env.PORT ?? 3001);

const server = serve({ fetch: app.fetch, port }, () => {
  console.log(`Logistics API listening on http://localhost:${port}`);
});

server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `Port ${port} is already in use. Stop the other process or run with PORT=<free-port> pnpm dev:api`,
    );
    process.exit(1);
  }
  throw error;
});
