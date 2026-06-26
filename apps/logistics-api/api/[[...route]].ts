import { handle } from "hono/vercel";
import { app } from "../src/app";

export default handle(app);

export const config = {
  runtime: "nodejs",
  maxDuration: 10,
};
