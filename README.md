# LoopBill
This system is designed for a pest control company to manage service packages, agents, sales personnel, and customer interactions in a streamlined way. The goal is to:
- Track scheduled services and their completion
- Automate reminders and invoicing
- Monitor agent and sales performance (KPIs)
- Allow structured complaint resolution and re-servicing

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Put Turso credentials in `.env` (`TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`) and keep `BETTER_AUTH_URL=http://localhost:3000`. Then migrate, seed, and start the app on port 3000:

```bash
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in as:

- Email: `vidyesh95@gmail.com`
- Password: `Password123!`

Other seeded staff use the same password. Customers are records only — they do not get portal logins.

## Database

This app uses **SQLite via Drizzle**. A `file:local.db` file is fine on your machine. **Do not use a local `.db` file on Vercel** — serverless disks are ephemeral.

For Vercel Hobby, create a free [Turso](https://turso.tech) database (hosted SQLite):

```bash
turso db create loopbill
turso db tokens create loopbill
```

Then set these in `.env` locally and on the Vercel project:

- `TURSO_DATABASE_URL` — `libsql://...turso.io`
- `TURSO_AUTH_TOKEN`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL` — `http://localhost:3000` locally, your Vercel URL in production

Apply schema and seed against whichever URL is in the env file:

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

`db:seed` is idempotent (wipe and reseed). Extra demo rows are generated with a fixed RNG so they stay the same each run.

## Auth

[Better Auth](https://www.better-auth.com) handles email/password sessions. Roles (`admin`, `salesperson`, `agent`) live on the user row. `/admin`, `/agent`, and `/salesperson` require a session; each layout also checks role.

Public sign-up is closed after staff exist. Create additional users from the admin portal later.

Google sign-in is on the sign-in page. The Google account email must already belong to a staff user (create that user in admin first). Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`, and add this Authorized redirect URI in Google Cloud Console:

`{BETTER_AUTH_URL}/api/auth/callback/google`

If the database is empty, the first Google sign-up on `/signup` creates the administrator.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Better Auth](https://www.better-auth.com/docs)
- [Turso + Drizzle](https://docs.turso.tech/sdk/ts/orm/drizzle)

## Deploy on Vercel

Deploy the Next.js app as usual. There is no separate backend. After the first deploy, set the four env vars above, run `db:migrate` and `db:seed` against the Turso URL, then redeploy if needed.
