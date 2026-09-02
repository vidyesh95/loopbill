"use server";

import { revalidatePath } from "next/cache";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { complaint, customer, rescheduleRequest, service } from "@/lib/db/schema";
import { dispatchNotification } from "@/lib/notifications/dispatch";
import {
  complaintAdminVisibleAt,
  formatDisplayDate,
  isComplaintSameMonth,
  parseFlexibleDate,
} from "@/lib/lifecycle";

const phoneSchema = z.object({
  phone: z.string().min(8),
  issue: z.string().min(4),
  complaintType: z.string().optional(),
});

function normalizePhone(value: string) {
  return value.replace(/\D/g, "").slice(-10);
}

async function findCustomerByPhone(phone: string) {
  const rows = await db.select().from(customer);
  const needle = normalizePhone(phone);
  return rows.find((row) => row.phone && normalizePhone(row.phone) === needle);
}

export async function submitPublicComplaint(input: z.infer<typeof phoneSchema>) {
  const parsed = phoneSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid complaint" };
  }

  const owner = await findCustomerByPhone(parsed.data.phone);
  if (!owner) {
    return { ok: false as const, error: "No customer found for that phone number." };
  }

  const [recent] = await db
    .select()
    .from(service)
    .where(eq(service.customerId, owner.id))
    .orderBy(desc(service.scheduledAt))
    .limit(1);
  if (!recent) {
    return { ok: false as const, error: "No service found for this customer." };
  }

  const raisedAt = new Date();
  const serviceDate = recent.scheduledAt ?? parseFlexibleDate(recent.date) ?? raisedAt;
  if (!isComplaintSameMonth(serviceDate, raisedAt)) {
    return {
      ok: false as const,
      error: "Complaints must be raised in the same calendar month as the service.",
    };
  }

  const [created] = await db
    .insert(complaint)
    .values({
      serviceId: recent.id,
      customerId: owner.id,
      complaintType: parsed.data.complaintType || "Service quality",
      priority: "Normal",
      status: "Unscheduled",
      date: formatDisplayDate(raisedAt),
      issue: parsed.data.issue,
      action: "Hidden from admin",
      raisedAt,
      visibleToAdminAt: complaintAdminVisibleAt(raisedAt),
    })
    .returning();

  await dispatchNotification({
    subject: `Complaint received — service #${recent.id}`,
    recipients: owner.name,
    type: "Complaint",
    methods: ["WhatsApp", "SMS"],
    phone: owner.phone,
  });

  revalidatePath("/salesperson/complaints");
  return { ok: true as const, data: { id: created.id } };
}

export async function submitPublicReschedule(input: {
  phone: string;
  requestedDate?: string;
  reason: string;
}) {
  if (!input.phone || !input.reason) {
    return { ok: false as const, error: "Phone and reason are required" };
  }
  const owner = await findCustomerByPhone(input.phone);
  const [recent] = owner
    ? await db
        .select()
        .from(service)
        .where(eq(service.customerId, owner.id))
        .orderBy(desc(service.scheduledAt))
        .limit(1)
    : [];

  await db.insert(rescheduleRequest).values({
    serviceId: recent?.id,
    customerId: owner?.id,
    phone: input.phone,
    requestedDate: input.requestedDate,
    reason: input.reason,
    status: "pending",
    source: "customer",
    createdAt: new Date(),
  });

  if (recent) {
    await db
      .update(service)
      .set({ status: "Reschedule required" })
      .where(eq(service.id, recent.id));
  }

  await dispatchNotification({
    subject: "Reschedule request received",
    recipients: owner?.name ?? input.phone,
    type: "Reschedule Required",
    methods: ["WhatsApp", "SMS"],
    phone: input.phone,
    actions: "Reschedule",
  });

  revalidatePath("/salesperson/reschedule");
  return { ok: true as const, data: { queued: true } };
}
