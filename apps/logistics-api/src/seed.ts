import { ensureSeeded } from "./db";
import { getStore } from "./store";

ensureSeeded();
getStore();
console.log("Database seeded and store initialized.");
