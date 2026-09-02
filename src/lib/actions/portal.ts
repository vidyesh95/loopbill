"use server";

import { revalidatePath } from "next/cache";
import { hashPassword } from "better-auth/crypto";
import { createLocalAccountIssuer } from "better-auth/db";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { account, customer, user } from "@/lib/db/schema";
import { fail, ok, requireActionRole, type ActionResult } from "@/lib/actions/_guard";

export async function provisionCustomerLogin(input: {
  customerId: number;
  email: string;
  password: string;
}): Promise<ActionResult<{ userId: string }>> {
  await requireActionRole(["admin", "salesperson"]);
  if (!input.email || input.password.length < 8) {
    return fail("Email and an 8+ character password are required");
  }
  const [row] = await db.select().from(customer).where(eq(customer.id, input.customerId)).limit(1);
  if (!row) {
    return fail("Customer not found");
  }
  if (row.userId) {
    return fail("This customer already has a portal login");
  }
  const [existing] = await db.select().from(user).where(eq(user.email, input.email)).limit(1);
  if (existing) {
    return fail("A user with this email already exists");
  }

  const now = new Date();
  const id = crypto.randomUUID();
  await db.insert(user).values({
    id,
    name: row.name,
    email: input.email,
    emailVerified: true,
    createdAt: now,
    updatedAt: now,
    role: "customer",
    phone: row.phone,
    department: "Customer",
    status: "active",
  });
  await db.insert(account).values({
    id: `acc_${id}`,
    accountId: id,
    providerId: "credential",
    issuer: createLocalAccountIssuer("credential"),
    userId: id,
    password: await hashPassword(input.password),
    createdAt: now,
    updatedAt: now,
  });
  await db.update(customer).set({ userId: id, email: input.email }).where(eq(customer.id, row.id));

  revalidatePath("/salesperson/customers");
  revalidatePath("/admin/user-management");
  return ok({ userId: id });
}
