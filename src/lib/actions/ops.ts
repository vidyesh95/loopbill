"use server";

import { revalidatePath } from "next/cache";
import { and, count, desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { complaint, contract, customer, invoice, location, service } from "@/lib/db/schema";
import { fail, ok, okEmpty, requireActionRole, type ActionResult } from "@/lib/actions/_guard";
import { dispatchNotification } from "@/lib/notifications/dispatch";
import {
  COMPLAINT_PRIORITIES,
  COMPLAINT_TYPES,
  CONTRACT_STATUSES,
  DEFAULT_MAX_RESCHEDULES,
  PAYMENT_FREQUENCIES,
  PAYMENT_STATUSES,
} from "@/lib/data/status";
import {
  assertServiceDate,
  asServiceStage,
  complaintAdminVisibleAt,
  formatDisplayDate,
  isComplaintSameMonth,
  parseFlexibleDate,
  redoEligible,
  canReschedule,
} from "@/lib/lifecycle";
import { getSettingNumber } from "@/lib/db/settings";
import { geocodeAddress } from "@/lib/geo/nominatim";

function revalidateOps() {
  revalidatePath("/admin");
  revalidatePath("/admin/services");
  revalidatePath("/admin/contracts");
  revalidatePath("/admin/complaints");
  revalidatePath("/salesperson");
  revalidatePath("/salesperson/customers");
  revalidatePath("/salesperson/schedule");
  revalidatePath("/salesperson/reschedule");
  revalidatePath("/salesperson/services");
  revalidatePath("/salesperson/complaints");
  revalidatePath("/agent");
  revalidatePath("/agent/schedule");
  revalidatePath("/agent/servicemap");
}

const customerSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.email().optional().or(z.literal("")),
  salespersonId: z.string().optional(),
  label: z.string().min(1),
  address: z.string().min(1),
  building: z.string().optional(),
  wing: z.string().optional(),
  flatNo: z.string().optional(),
  locationId: z.number().optional(),
});

async function previousCompletedForContract(
  contractId: number | null | undefined,
  beforeNumber: number,
) {
  if (!contractId) {
    return null;
  }
  const rows = await db
    .select()
    .from(service)
    .where(and(eq(service.contractId, contractId), eq(service.status, "Completed")))
    .orderBy(desc(service.serviceNumber));
  return rows.find((row) => row.serviceNumber < beforeNumber) ?? null;
}

export async function upsertCustomer(
  input: z.infer<typeof customerSchema>,
): Promise<ActionResult<{ customerId: number }>> {
  const session = await requireActionRole(["admin", "salesperson"]);
  const parsed = customerSchema.safeParse(input);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid customer");
  }

  const salespersonId =
    parsed.data.salespersonId ?? (session.user.role === "salesperson" ? session.user.id : null);
  let customerId = parsed.data.id;
  const coords = await geocodeAddress(parsed.data.address);

  if (customerId) {
    await db
      .update(customer)
      .set({
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email || null,
        salespersonId,
      })
      .where(eq(customer.id, customerId));
    if (parsed.data.locationId) {
      await db
        .update(location)
        .set({
          label: parsed.data.label,
          address: parsed.data.address,
          building: parsed.data.building,
          wing: parsed.data.wing,
          flatNo: parsed.data.flatNo,
          lat: coords?.lat,
          lng: coords?.lng,
        })
        .where(eq(location.id, parsed.data.locationId));
    } else {
      await db.insert(location).values({
        customerId,
        label: parsed.data.label,
        address: parsed.data.address,
        building: parsed.data.building,
        wing: parsed.data.wing,
        flatNo: parsed.data.flatNo,
        lat: coords?.lat,
        lng: coords?.lng,
      });
    }
  } else {
    const [created] = await db
      .insert(customer)
      .values({
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email || null,
        salespersonId,
      })
      .returning();
    customerId = created.id;
    await db.insert(location).values({
      customerId,
      label: parsed.data.label,
      address: parsed.data.address,
      building: parsed.data.building,
      wing: parsed.data.wing,
      flatNo: parsed.data.flatNo,
      lat: coords?.lat,
      lng: coords?.lng,
    });
  }

  revalidateOps();
  return ok({ customerId: customerId! });
}

export async function createContract(input: {
  customerId: number;
  locationId?: number;
  packageId?: number;
  serviceType: string;
  contractValue: number;
  paymentStatus: string;
  paymentFrequency: string;
  nextPayment?: string;
  contractDate: string;
  expiryDate: string;
  salespersonId?: string;
}): Promise<ActionResult<{ id: number }>> {
  const session = await requireActionRole(["admin", "salesperson"]);
  const [existing] = await db
    .select()
    .from(contract)
    .where(eq(contract.customerId, input.customerId))
    .limit(1);
  if (existing?.locked) {
    return fail("This contract is locked after expiry.");
  }

  const purchasedAt = parseFlexibleDate(input.contractDate) ?? new Date();
  const [created] = await db
    .insert(contract)
    .values({
      customerId: input.customerId,
      locationId: input.locationId,
      packageId: input.packageId,
      salespersonId:
        input.salespersonId ?? (session.user.role === "salesperson" ? session.user.id : null),
      serviceType: input.serviceType,
      contractValue: input.contractValue,
      paymentStatus: PAYMENT_STATUSES.includes(
        input.paymentStatus as (typeof PAYMENT_STATUSES)[number],
      )
        ? input.paymentStatus
        : "Pending",
      paymentFrequency: PAYMENT_FREQUENCIES.includes(
        input.paymentFrequency as (typeof PAYMENT_FREQUENCIES)[number],
      )
        ? input.paymentFrequency
        : "Quarterly",
      nextPayment: input.nextPayment,
      contractDate: input.contractDate,
      expiryDate: input.expiryDate,
      purchasedAt,
      locked: false,
      status: CONTRACT_STATUSES.includes("Active") ? "Active" : input.paymentStatus,
    })
    .returning();

  const issuedAt = new Date();
  const due = new Date(issuedAt);
  if (created.paymentFrequency === "Monthly") {
    due.setMonth(due.getMonth() + 1);
  } else if (created.paymentFrequency === "Quarterly") {
    due.setMonth(due.getMonth() + 3);
  } else if (created.paymentFrequency === "Half-yearly") {
    due.setMonth(due.getMonth() + 6);
  } else {
    due.setFullYear(due.getFullYear() + 1);
  }
  const [countRow] = await db.select({ value: count() }).from(invoice);
  await db.insert(invoice).values({
    contractId: created.id,
    customerId: created.customerId,
    number: `INV-${String((countRow?.value ?? 0) + 1).padStart(5, "0")}`,
    amount: created.contractValue,
    status: created.paymentStatus === "Paid" ? "Paid" : "Issued",
    issuedAt,
    dueAt: due,
    paidAt: created.paymentStatus === "Paid" ? issuedAt : null,
    notes: created.serviceType,
  });

  revalidateOps();
  revalidatePath("/admin/billing");
  return ok({ id: created.id });
}

export async function setContractLocked(id: number, locked: boolean): Promise<ActionResult> {
  await requireActionRole(["admin"]);
  await db
    .update(contract)
    .set({
      locked,
      status: locked ? "Expired" : "Active",
    })
    .where(eq(contract.id, id));
  if (locked) {
    await db
      .update(invoice)
      .set({ status: "Void" })
      .where(
        and(eq(invoice.contractId, id), inArray(invoice.status, ["Draft", "Issued", "Overdue"])),
      );
  }
  revalidateOps();
  revalidatePath("/admin/billing");
  return okEmpty();
}

export async function scheduleService(input: {
  customerId: number;
  contractId?: number;
  locationId?: number;
  serviceType: string;
  date: string;
  agentId?: string;
  amount?: number;
  serviceNumber?: number;
  notes?: string;
  override?: boolean;
}): Promise<ActionResult<{ id: number }>> {
  const session = await requireActionRole(["admin", "salesperson"]);
  const proposedDate = parseFlexibleDate(input.date) ?? new Date();
  const serviceNumber = asServiceStage(input.serviceNumber ?? 1);
  const allowOverride = session.user.role === "admin" && Boolean(input.override);

  let contractRow = input.contractId
    ? (await db.select().from(contract).where(eq(contract.id, input.contractId)).limit(1))[0]
    : (
        await db.select().from(contract).where(eq(contract.customerId, input.customerId)).limit(1)
      )[0];

  if (contractRow?.locked && !allowOverride) {
    return fail("Contract is locked. An administrator must unlock it before scheduling.");
  }

  const previous = await previousCompletedForContract(contractRow?.id, serviceNumber);
  const check = assertServiceDate({
    serviceNumber,
    proposedDate,
    purchasedAt: contractRow?.purchasedAt,
    previousCompletedAt: previous?.completedAt ?? previous?.scheduledAt,
    allowOverride,
  });
  if (!check.ok) {
    return fail(check.error);
  }

  const [created] = await db
    .insert(service)
    .values({
      contractId: contractRow?.id,
      customerId: input.customerId,
      locationId: input.locationId ?? contractRow?.locationId,
      serviceType: input.serviceType,
      date: formatDisplayDate(proposedDate),
      scheduledAt: proposedDate,
      agentId: input.agentId || null,
      status: input.agentId ? "Scheduled" : "Unscheduled",
      amount: input.amount ?? 0,
      serviceNumber,
      notes: input.notes,
    })
    .returning();

  revalidateOps();
  return ok({ id: created.id });
}

export async function rescheduleService(input: {
  serviceId: number;
  date: string;
  agentId?: string;
  override?: boolean;
}): Promise<ActionResult> {
  const session = await requireActionRole(["admin", "salesperson"]);
  const [row] = await db.select().from(service).where(eq(service.id, input.serviceId)).limit(1);
  if (!row) {
    return fail("Service not found");
  }

  const maxReschedules = await getSettingNumber("maxReschedules", DEFAULT_MAX_RESCHEDULES);
  const allowOverride = session.user.role === "admin" && Boolean(input.override);
  if (!allowOverride && !canReschedule(row.rescheduleCount, maxReschedules)) {
    return fail(`Maximum of ${maxReschedules} reschedules reached for this service.`);
  }

  const proposedDate = parseFlexibleDate(input.date) ?? new Date();
  const contractRow = row.contractId
    ? (await db.select().from(contract).where(eq(contract.id, row.contractId)).limit(1))[0]
    : undefined;
  const previous = await previousCompletedForContract(row.contractId, row.serviceNumber);
  const check = assertServiceDate({
    serviceNumber: row.serviceNumber,
    proposedDate,
    purchasedAt: contractRow?.purchasedAt,
    previousCompletedAt: previous?.completedAt ?? previous?.scheduledAt,
    allowOverride,
  });
  if (!check.ok) {
    return fail(check.error);
  }

  await db
    .update(service)
    .set({
      date: formatDisplayDate(proposedDate),
      scheduledAt: proposedDate,
      agentId: input.agentId ?? row.agentId,
      status: "Scheduled",
      rescheduleCount: row.rescheduleCount + 1,
      absenceReportedAt: null,
    })
    .where(eq(service.id, row.id));

  if (row.rescheduleCount + 1 >= maxReschedules && contractRow) {
    await db
      .update(contract)
      .set({ rescheduleFlags: (contractRow.rescheduleFlags ?? 0) + 1 })
      .where(eq(contract.id, contractRow.id));
  }

  revalidateOps();
  return okEmpty();
}

export async function createComplaint(input: {
  serviceId: number;
  customerId: number;
  complaintType: string;
  priority: string;
  issue?: string;
}): Promise<ActionResult<{ id: number }>> {
  await requireActionRole(["admin", "salesperson"]);
  const [serviceRow] = await db
    .select()
    .from(service)
    .where(eq(service.id, input.serviceId))
    .limit(1);
  if (!serviceRow) {
    return fail("Service not found");
  }
  const raisedAt = new Date();
  const serviceDate = serviceRow.scheduledAt ?? parseFlexibleDate(serviceRow.date) ?? raisedAt;
  if (!isComplaintSameMonth(serviceDate, raisedAt)) {
    return fail("Complaints must be raised in the same calendar month as the original service.");
  }

  const [created] = await db
    .insert(complaint)
    .values({
      serviceId: input.serviceId,
      customerId: input.customerId,
      complaintType: COMPLAINT_TYPES.includes(
        input.complaintType as (typeof COMPLAINT_TYPES)[number],
      )
        ? input.complaintType
        : "Service quality",
      priority: COMPLAINT_PRIORITIES.includes(
        input.priority as (typeof COMPLAINT_PRIORITIES)[number],
      )
        ? input.priority
        : "Normal",
      status: "Unscheduled",
      date: formatDisplayDate(raisedAt),
      issue: input.issue,
      action: "Hidden from admin",
      raisedAt,
      visibleToAdminAt: complaintAdminVisibleAt(raisedAt),
    })
    .returning();

  revalidateOps();
  return ok({ id: created.id });
}

export async function attendComplaint(id: number, action?: string): Promise<ActionResult> {
  await requireActionRole(["admin", "salesperson"]);
  await db
    .update(complaint)
    .set({
      status: "In progress",
      attendedAt: new Date(),
      action: action ?? "Attended",
    })
    .where(eq(complaint.id, id));
  revalidateOps();
  return okEmpty();
}

export async function resolveComplaint(id: number): Promise<ActionResult> {
  await requireActionRole(["admin", "salesperson"]);
  await db
    .update(complaint)
    .set({
      status: "Resolved",
      attendedAt: new Date(),
      action: "Resolved",
    })
    .where(eq(complaint.id, id));
  revalidateOps();
  return okEmpty();
}

export async function assignRedo(input: {
  complaintId: number;
  agentId: string;
  date: string;
  override?: boolean;
}): Promise<ActionResult<{ serviceId: number }>> {
  await requireActionRole(["admin"]);
  const [row] = await db
    .select()
    .from(complaint)
    .where(eq(complaint.id, input.complaintId))
    .limit(1);
  if (!row) {
    return fail("Complaint not found");
  }
  const check = redoEligible({
    attendedAt: row.attendedAt,
    existingRedoId: row.redoServiceId,
    allowOverride: input.override,
  });
  if (!check.ok) {
    return fail(check.error);
  }

  const [original] = await db.select().from(service).where(eq(service.id, row.serviceId)).limit(1);
  if (!original) {
    return fail("Original service not found");
  }

  const proposedDate = parseFlexibleDate(input.date) ?? new Date();
  const [created] = await db
    .insert(service)
    .values({
      contractId: original.contractId,
      customerId: original.customerId,
      locationId: original.locationId,
      serviceType: original.serviceType,
      date: formatDisplayDate(proposedDate),
      scheduledAt: proposedDate,
      agentId: input.agentId,
      status: "Scheduled",
      amount: original.amount,
      serviceNumber: original.serviceNumber,
      redoOfServiceId: original.id,
      notes: `Redo for complaint #${row.id}`,
    })
    .returning();

  await db
    .update(complaint)
    .set({
      redoServiceId: created.id,
      status: "Scheduled",
      action: "Redo assigned",
    })
    .where(eq(complaint.id, row.id));
  await db.update(service).set({ status: "Redo required" }).where(eq(service.id, original.id));

  revalidateOps();
  return ok({ serviceId: created.id });
}

export async function verifyService(
  serviceId: number,
  requestRework?: boolean,
): Promise<ActionResult> {
  await requireActionRole(["admin", "salesperson"]);
  await db
    .update(service)
    .set({ status: requestRework ? "Redo required" : "Completed" })
    .where(eq(service.id, serviceId));
  revalidateOps();
  return okEmpty();
}

export async function sendManualNotification(input: {
  subject: string;
  recipients: string;
  type: string;
  methods?: Array<"Email" | "SMS" | "WhatsApp" | "Push">;
  message?: string;
}): Promise<ActionResult> {
  await requireActionRole(["admin", "salesperson"]);
  await dispatchNotification(input);
  revalidatePath("/admin/notifications");
  revalidatePath("/salesperson/notifications");
  return okEmpty();
}
