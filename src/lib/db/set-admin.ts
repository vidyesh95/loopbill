import { config } from "dotenv";
import { createLocalAccountIssuer } from "better-auth/db";
import { hashPassword } from "better-auth/crypto";
import { and, eq, ne } from "drizzle-orm";

config({ path: ".env.local" });
config({ path: ".env", override: true });

import { db } from "./index";
import { account, permission, user, userPermission } from "./schema";

const ADMIN_EMAIL = "vidyesh95@gmail.com";
const ADMIN_NAME = "Vidyesh";
const ADMIN_ID = "staff_vidyesh";
const DEV_PASSWORD = "Password123!";

const salespersonPermissionIds = [
  "dashboard",
  "customers",
  "services",
  "reports",
  "complaints",
  "notifications",
  "contracts",
];

async function replacePermissions(userId: string, permissionIds: string[]) {
  await db.delete(userPermission).where(eq(userPermission.userId, userId));
  if (permissionIds.length === 0) {
    return;
  }
  await db.insert(userPermission).values(
    permissionIds.map((permissionId) => ({
      userId,
      permissionId,
    })),
  );
}

async function ensureCredentialAccount(userId: string, passwordHash: string, now: Date) {
  const [existing] = await db
    .select({ id: account.id })
    .from(account)
    .where(and(eq(account.userId, userId), eq(account.providerId, "credential")));

  if (existing) {
    await db
      .update(account)
      .set({
        password: passwordHash,
        updatedAt: now,
      })
      .where(eq(account.id, existing.id));
    return;
  }

  await db.insert(account).values({
    id: `acc_${userId}`,
    accountId: userId,
    providerId: "credential",
    issuer: createLocalAccountIssuer("credential"),
    userId,
    password: passwordHash,
    createdAt: now,
    updatedAt: now,
  });
}

async function setAdmin() {
  const now = new Date();
  const passwordHash = await hashPassword(DEV_PASSWORD);
  const allPermissions = await db.select({ id: permission.id }).from(permission);
  const adminPermissionIds = allPermissions.map((row) => row.id);

  const otherAdmins = await db
    .select()
    .from(user)
    .where(and(eq(user.role, "admin"), ne(user.email, ADMIN_EMAIL)));

  for (const admin of otherAdmins) {
    await db
      .update(user)
      .set({
        role: "salesperson",
        updatedAt: now,
      })
      .where(eq(user.id, admin.id));
    await replacePermissions(admin.id, salespersonPermissionIds);
    console.log(`Demoted ${admin.email} from admin to salesperson`);
  }

  const [existing] = await db.select().from(user).where(eq(user.email, ADMIN_EMAIL));

  if (existing) {
    await db
      .update(user)
      .set({
        role: "admin",
        department: existing.department ?? "Management",
        status: "active",
        emailVerified: true,
        updatedAt: now,
      })
      .where(eq(user.id, existing.id));
    await replacePermissions(existing.id, adminPermissionIds);
    await ensureCredentialAccount(existing.id, passwordHash, now);
    console.log(`Promoted ${ADMIN_EMAIL} to admin`);
  } else {
    await db.insert(user).values({
      id: ADMIN_ID,
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      emailVerified: true,
      createdAt: now,
      updatedAt: now,
      role: "admin",
      department: "Management",
      status: "active",
    });
    await ensureCredentialAccount(ADMIN_ID, passwordHash, now);
    await replacePermissions(ADMIN_ID, adminPermissionIds);
    console.log(`Created admin ${ADMIN_EMAIL}`);
  }

  console.log(`Sole admin: ${ADMIN_EMAIL} / ${DEV_PASSWORD}`);
}

setAdmin()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
