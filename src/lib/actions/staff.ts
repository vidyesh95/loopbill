"use server";

import { revalidatePath } from "next/cache";
import { hashPassword } from "better-auth/crypto";
import { createLocalAccountIssuer } from "better-auth/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { account, user, userPermission } from "@/lib/db/schema";
import { fail, ok, okEmpty, requireActionRole, type ActionResult } from "@/lib/actions/_guard";
import { roleFromLabel, USER_ROLES, USER_STATUSES } from "@/lib/data/status";

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  phone: z.string().min(1),
  role: z.string(),
  department: z.string().min(1),
  password: z.string().min(8),
});

const updateUserSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.email(),
  phone: z.string().optional(),
  department: z.string().optional(),
  status: z.enum(USER_STATUSES).optional(),
});

function permissionIdsForRole(role: string) {
  if (role === "admin") {
    return [
      "dashboard",
      "users",
      "customers",
      "services",
      "reports",
      "settings",
      "complaints",
      "notifications",
      "contracts",
      "billing",
    ];
  }
  if (role === "salesperson") {
    return [
      "dashboard",
      "customers",
      "services",
      "reports",
      "complaints",
      "notifications",
      "contracts",
    ];
  }
  return ["dashboard", "services", "complaints"];
}

function normalizeRole(value: string) {
  if (USER_ROLES.includes(value as (typeof USER_ROLES)[number])) {
    return value;
  }
  return roleFromLabel(value);
}

export async function createStaffUser(
  input: z.infer<typeof createUserSchema>,
): Promise<ActionResult<{ id: string }>> {
  await requireActionRole(["admin"]);
  const parsed = createUserSchema.safeParse(input);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid user");
  }

  const role = normalizeRole(parsed.data.role);
  const [existing] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, parsed.data.email))
    .limit(1);
  if (existing) {
    return fail("A user with this email already exists");
  }

  const now = new Date();
  const id = crypto.randomUUID();
  const passwordHash = await hashPassword(parsed.data.password);

  await db.insert(user).values({
    id,
    name: parsed.data.name,
    email: parsed.data.email,
    emailVerified: true,
    createdAt: now,
    updatedAt: now,
    role,
    phone: parsed.data.phone,
    department: parsed.data.department,
    status: "active",
  });
  await db.insert(account).values({
    id: `acc_${id}`,
    accountId: id,
    providerId: "credential",
    issuer: createLocalAccountIssuer("credential"),
    userId: id,
    password: passwordHash,
    createdAt: now,
    updatedAt: now,
  });
  await db
    .insert(userPermission)
    .values(permissionIdsForRole(role).map((permissionId) => ({ userId: id, permissionId })));

  revalidatePath("/admin/user-management");
  return ok({ id });
}

export async function updateStaffUser(
  input: z.infer<typeof updateUserSchema>,
): Promise<ActionResult> {
  await requireActionRole(["admin"]);
  const parsed = updateUserSchema.safeParse(input);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid user");
  }

  await db
    .update(user)
    .set({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      department: parsed.data.department,
      status: parsed.data.status,
      updatedAt: new Date(),
    })
    .where(eq(user.id, parsed.data.id));

  revalidatePath("/admin/user-management");
  return okEmpty();
}

export async function updateStaffPermissions(input: {
  id: string;
  role?: string;
  permissions: string[];
}): Promise<ActionResult> {
  await requireActionRole(["admin"]);
  const role = input.role ? normalizeRole(input.role) : undefined;
  await db
    .update(user)
    .set({
      ...(role ? { role } : {}),
      updatedAt: new Date(),
    })
    .where(eq(user.id, input.id));
  await db.delete(userPermission).where(eq(userPermission.userId, input.id));
  if (input.permissions.length > 0) {
    await db
      .insert(userPermission)
      .values(input.permissions.map((permissionId) => ({ userId: input.id, permissionId })));
  }
  revalidatePath("/admin/user-management");
  return okEmpty();
}

export async function deactivateStaffUser(id: string): Promise<ActionResult> {
  await requireActionRole(["admin"]);
  await db.update(user).set({ status: "inactive", updatedAt: new Date() }).where(eq(user.id, id));
  revalidatePath("/admin/user-management");
  return okEmpty();
}
