import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { customer } from "@/lib/db/schema";
import { requireRole } from "@/lib/session";

export async function requireCustomerRecord() {
  const session = await requireRole(["customer"]);
  const [row] = await db
    .select()
    .from(customer)
    .where(eq(customer.userId, session.user.id))
    .limit(1);
  if (!row) {
    return { session, customer: null };
  }
  return { session, customer: row };
}
