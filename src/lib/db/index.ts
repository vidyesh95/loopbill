import path from "node:path";
import {createClient} from "@libsql/client";
import {drizzle} from "drizzle-orm/libsql";
import * as schema from "./schema";

function databaseUrl() {
    const url = process.env.TURSO_DATABASE_URL?.trim();
    if (!url || url.startsWith("file:")) {
        const filePath = url?.replace(/^file:/, "") || "local.db";
        return `file:${path.resolve(process.cwd(), filePath)}`;
    }
    return url;
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
