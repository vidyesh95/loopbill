import {count} from "drizzle-orm";
import {betterAuth} from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import {nextCookies} from "better-auth/next-js";
import {db} from "@/lib/db";
import * as schema from "@/lib/db/schema";
import {isGoogleOAuthConfigured} from "@/lib/oauth";

function trustedOrigins() {
    const origins = new Set<string>([process.env.BETTER_AUTH_URL ?? "http://localhost:3000"]);
    if (process.env.VERCEL_URL) {
        origins.add(`https://${process.env.VERCEL_URL}`);
    }
    return [...origins];
}

const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigins: trustedOrigins(),
    database: drizzleAdapter(db, {
        provider: "sqlite",
        schema,
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: isGoogleOAuthConfigured() && googleClientId && googleClientSecret
        ? {
            google: {
                clientId: googleClientId,
                clientSecret: googleClientSecret,
                prompt: "select_account",
                disableImplicitSignUp: true,
            },
        }
        : {},
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google"],
        },
    },
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    const [result] = await db.select({value: count()}).from(schema.user);
                    const isFirstStaff = (result?.value ?? 0) === 0;
                    return {
                        data: {
                            ...user,
                            role: isFirstStaff ? "admin" : (user.role ?? "agent"),
                            status: user.status ?? "active",
                            department: user.department ?? (isFirstStaff ? "Management" : user.department),
                        },
                    };
                },
            },
        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: "agent",
                input: false,
            },
            phone: {
                type: "string",
                required: false,
            },
            department: {
                type: "string",
                required: false,
            },
            status: {
                type: "string",
                required: false,
                defaultValue: "active",
                input: false,
            },
        },
    },
    plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
export type UserRole = "admin" | "salesperson" | "agent";
