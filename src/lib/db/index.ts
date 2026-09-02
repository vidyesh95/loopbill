import path from "node:path";
import {createClient} from "@libsql/client";
import {drizzle} from "drizzle-orm/libsql";
import * as schema from "./schema";

function databaseUrl() {
    const url = process.env.TURSO_DATABASE_URL?.trim();
    if (url && !url.startsWith("file:")) {
        return url;
    }

    if (process.env.VERCEL) {
        throw new Error("TURSO_DATABASE_URL must be a remote libsql URL on Vercel");
    }

    const filePath = url?.replace(/^file:/, "") || "local.db";
    return `file:${path.resolve(/* turbopackIgnore: true */ process.cwd(), filePath)}`;
}

function createDb(url: string) {
    const client = createClient({
        url,
        authToken: url.startsWith("file:") ? undefined : process.env.TURSO_AUTH_TOKEN,
    });
    return drizzle(client, {schema});
}

const globalForDb = globalThis as unknown as {
    loopbillDb?: ReturnType<typeof createDb>;
    loopbillDbUrl?: string;
};

const url = databaseUrl();
export const db = globalForDb.loopbillDbUrl === url && globalForDb.loopbillDb
    ? globalForDb.loopbillDb
    : createDb(url);

if (process.env.NODE_ENV !== "production") {
    globalForDb.loopbillDb = db;
    globalForDb.loopbillDbUrl = url;
}
