import { and, eq, inArray, isNotNull, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import { complaint, contract, service, customer, appSetting } from "@/lib/db/schema";
import { dispatchNotification } from "@/lib/notifications/dispatch";
import { CONTRACT_LOCK_DAYS, INTERVAL_MAX_DAYS, INTERVAL_MIN_DAYS } from "@/lib/data/status";
import { daysBetween } from "@/lib/lifecycle";

export type LifecycleTickResult = {
  reminders: number;
  lockedContracts: number;
  visibleComplaints: number;
};

async function getSetting(key: string, fallback: string) {
  const [row] = await db.select().from(appSetting).where(eq(appSetting.key, key)).limit(1);
  return row?.value ?? fallback;
}

export async function runLifecycleTick(now = new Date()): Promise<LifecycleTickResult> {
  const remindersEnabled = (await getSetting("remindersEnabled", "true")) === "true";

  let reminders = 0;
  let lockedContracts = 0;
  let visibleComplaints = 0;

  const pendingComplaints = await db
    .select()
    .from(complaint)
    .where(and(ne(complaint.status, "Resolved"), isNotNull(complaint.visibleToAdminAt)));

  for (const row of pendingComplaints) {
    if (row.visibleToAdminAt && row.visibleToAdminAt <= now && row.action === "Hidden from admin") {
      await db.update(complaint).set({ action: "Assign redo" }).where(eq(complaint.id, row.id));
      visibleComplaints += 1;
    }
  }

  const activeContracts = await db
    .select()
    .from(contract)
    .where(and(inArray(contract.status, ["Active", "Expiring Soon"]), eq(contract.locked, false)));

  for (const row of activeContracts) {
    const visits = await db.select().from(service).where(eq(service.contractId, row.id));

    const completed = visits
      .filter((item) => item.status === "Completed" && item.completedAt)
      .sort((a, b) => (a.completedAt?.getTime() ?? 0) - (b.completedAt?.getTime() ?? 0));
    const lastCompleted = completed.at(-1);
    const nextPending = visits
      .filter((item) => item.status !== "Completed" && item.status !== "Expired")
      .sort((a, b) => a.serviceNumber - b.serviceNumber)[0];

    const anchor = lastCompleted?.completedAt ?? row.purchasedAt;
    if (!anchor) {
      continue;
    }

    const days = daysBetween(anchor, now);
    const [customerRow] = await db
      .select()
      .from(customer)
      .where(eq(customer.id, row.customerId))
      .limit(1);
    const recipient = customerRow?.name ?? `Customer #${row.customerId}`;

    if (days > CONTRACT_LOCK_DAYS && !nextPending?.scheduledAt) {
      await db
        .update(contract)
        .set({ locked: true, status: "Expired" })
        .where(eq(contract.id, row.id));
      if (nextPending) {
        await db.update(service).set({ status: "Expired" }).where(eq(service.id, nextPending.id));
      }
      if (remindersEnabled) {
        await dispatchNotification({
          subject: `Contract expired — ${row.serviceType}`,
          recipients: recipient,
          type: "Contract Expiry",
          methods: ["WhatsApp", "SMS", "Email"],
          phone: customerRow?.phone,
        });
        reminders += 1;
      }
      lockedContracts += 1;
      continue;
    }

    if (days >= CONTRACT_LOCK_DAYS - 30 && row.status === "Active") {
      await db.update(contract).set({ status: "Expiring Soon" }).where(eq(contract.id, row.id));
    }

    if (!remindersEnabled || !nextPending || nextPending.status === "Scheduled") {
      continue;
    }

    const alreadyReminded = await db
      .select()
      .from(service)
      .where(eq(service.id, nextPending.id))
      .limit(1);

    if (days === INTERVAL_MIN_DAYS || days === INTERVAL_MAX_DAYS || days === CONTRACT_LOCK_DAYS) {
      await dispatchNotification({
        subject: `Service reminder (Day ${days}) — ${row.serviceType}`,
        recipients: recipient,
        type: "Service Reminder",
        methods: ["WhatsApp", "SMS"],
        phone: customerRow?.phone,
        actions: alreadyReminded[0] ? "View details" : "Schedule",
      });
      reminders += 1;
    }
  }

  return { reminders, lockedContracts, visibleComplaints };
}
