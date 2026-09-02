"use server";

import { revalidatePath } from "next/cache";
import { and, count, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { contract, customer, invoice } from "@/lib/db/schema";
import { fail, ok, okEmpty, requireActionRole, type ActionResult } from "@/lib/actions/_guard";

function revalidateBilling() {
  revalidatePath("/admin/billing");
  revalidatePath("/admin/contracts");
  revalidatePath("/account");
  revalidatePath("/account/invoices");
}

async function nextInvoiceNumber() {
  const [row] = await db.select({ value: count() }).from(invoice);
  return `INV-${String((row?.value ?? 0) + 1).padStart(5, "0")}`;
}

function dueFromFrequency(issued: Date, frequency: string) {
  const due = new Date(issued);
  if (frequency === "Monthly") {
    due.setMonth(due.getMonth() + 1);
  } else if (frequency === "Quarterly") {
    due.setMonth(due.getMonth() + 3);
  } else if (frequency === "Half-yearly") {
    due.setMonth(due.getMonth() + 6);
  } else {
    due.setFullYear(due.getFullYear() + 1);
  }
  return due;
}

export async function issueInvoice(input: {
  contractId: number;
  amount?: number;
  notes?: string;
}): Promise<ActionResult<{ id: number; number: string }>> {
  await requireActionRole(["admin", "salesperson"]);
  const [row] = await db.select().from(contract).where(eq(contract.id, input.contractId)).limit(1);
  if (!row) {
    return fail("Contract not found");
  }
  if (row.locked) {
    return fail("Locked contracts cannot receive new invoices");
  }
  const issuedAt = new Date();
  const number = await nextInvoiceNumber();
  const [created] = await db
    .insert(invoice)
    .values({
      contractId: row.id,
      customerId: row.customerId,
      number,
      amount: input.amount ?? row.contractValue,
      status: "Issued",
      issuedAt,
      dueAt: dueFromFrequency(issuedAt, row.paymentFrequency),
      notes: input.notes ?? row.serviceType,
    })
    .returning();
  await db.update(contract).set({ paymentStatus: "Pending" }).where(eq(contract.id, row.id));
  revalidateBilling();
  return ok({ id: created.id, number: created.number });
}

export async function markInvoicePaid(id: number): Promise<ActionResult> {
  await requireActionRole(["admin", "salesperson"]);
  const [row] = await db.select().from(invoice).where(eq(invoice.id, id)).limit(1);
  if (!row) {
    return fail("Invoice not found");
  }
  if (row.status === "Void") {
    return fail("Void invoices cannot be marked paid");
  }
  await db.update(invoice).set({ status: "Paid", paidAt: new Date() }).where(eq(invoice.id, id));
  if (row.contractId) {
    const open = await db
      .select()
      .from(invoice)
      .where(
        and(
          eq(invoice.contractId, row.contractId),
          inArray(invoice.status, ["Issued", "Overdue", "Draft"]),
        ),
      );
    const remaining = open.filter((item) => item.id !== id);
    await db
      .update(contract)
      .set({ paymentStatus: remaining.length === 0 ? "Paid" : "Pending" })
      .where(eq(contract.id, row.contractId));
  }
  revalidateBilling();
  return okEmpty();
}

export async function voidInvoice(id: number): Promise<ActionResult> {
  await requireActionRole(["admin"]);
  const [row] = await db.select().from(invoice).where(eq(invoice.id, id)).limit(1);
  if (!row) {
    return fail("Invoice not found");
  }
  await db.update(invoice).set({ status: "Void" }).where(eq(invoice.id, id));
  revalidateBilling();
  return okEmpty();
}

export async function updateContractPayment(input: {
  contractId: number;
  paymentStatus: string;
  nextPayment?: string;
}): Promise<ActionResult> {
  await requireActionRole(["admin", "salesperson"]);
  await db
    .update(contract)
    .set({
      paymentStatus: input.paymentStatus,
      nextPayment: input.nextPayment,
    })
    .where(eq(contract.id, input.contractId));
  revalidateBilling();
  return okEmpty();
}

export async function getInvoiceForPdf(id: number) {
  const [row] = await db
    .select({
      invoice,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      serviceType: contract.serviceType,
    })
    .from(invoice)
    .innerJoin(customer, eq(invoice.customerId, customer.id))
    .leftJoin(contract, eq(invoice.contractId, contract.id))
    .where(eq(invoice.id, id))
    .limit(1);
  return row ?? null;
}
