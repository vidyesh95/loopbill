"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { customer, lead, location } from "@/lib/db/schema";
import { fail, ok, okEmpty, requireActionRole, type ActionResult } from "@/lib/actions/_guard";
import { LEAD_STATUSES } from "@/lib/data/status";

export async function updateLeadStatus(id: number, status: string): Promise<ActionResult> {
  await requireActionRole(["admin", "salesperson"]);
  if (!LEAD_STATUSES.includes(status as (typeof LEAD_STATUSES)[number])) {
    return fail("Invalid lead status");
  }
  await db.update(lead).set({ status }).where(eq(lead.id, id));
  revalidatePath("/admin/leads");
  revalidatePath("/salesperson/leads");
  return okEmpty();
}

export async function convertLeadToCustomer(
  id: number,
): Promise<ActionResult<{ customerId: number }>> {
  const session = await requireActionRole(["admin", "salesperson"]);
  const [row] = await db.select().from(lead).where(eq(lead.id, id)).limit(1);
  if (!row) {
    return fail("Lead not found");
  }

  const [created] = await db
    .insert(customer)
    .values({
      name: row.name,
      phone: row.phone,
      email: row.email,
      salespersonId: session.user.role === "salesperson" ? session.user.id : null,
    })
    .returning();

  await db.insert(location).values({
    customerId: created.id,
    label: row.propertyType,
    address: row.message.slice(0, 200) || row.propertyType,
  });
  await db.update(lead).set({ status: "converted" }).where(eq(lead.id, id));

  revalidatePath("/admin/leads");
  revalidatePath("/salesperson/leads");
  revalidatePath("/salesperson/customers");
  return ok({ customerId: created.id });
}
