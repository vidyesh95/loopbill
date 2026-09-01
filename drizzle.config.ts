import {config} from "dotenv";
import {defineConfig} from "drizzle-kit";

config({path: ".env.local"});
config({path: ".env", override: true});

const url = process.env.TURSO_DATABASE_URL?.trim() || "file:local.db";
const isFile = url.startsWith("file:");

export default defineConfig({
    schema: "./src/lib/db/schema.ts",
    out: "./drizzle",
    dialect: isFile ? "sqlite" : "turso",
    dbCredentials: isFile
        ? {url}
        : {
              url,
              authToken: process.env.TURSO_AUTH_TOKEN!,
          },
});
