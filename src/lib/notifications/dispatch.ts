import { db } from "@/lib/db";
import { notification } from "@/lib/db/schema";
import { formatDisplayDate } from "@/lib/lifecycle";

export type NotificationChannel = "Email" | "SMS" | "WhatsApp" | "Push";

export async function dispatchNotification(input: {
  subject: string;
  recipients: string;
  type: string;
  methods?: NotificationChannel[];
  status?: "Delivered" | "Sending" | "Scheduled";
  actions?: string;
  phone?: string | null;
}) {
  const methods = input.methods ?? ["WhatsApp", "SMS"];
  const method = methods.join(", ");
  const now = new Date();

  for (const channel of methods) {
    const target = input.phone ? `${input.recipients} <${input.phone}>` : input.recipients;
    console.log(`would send ${channel} to ${target}: ${input.subject}`);
  }

  const [row] = await db
    .insert(notification)
    .values({
      subject: input.subject,
      recipients: input.recipients,
      type: input.type,
      method,
      status: input.status ?? "Delivered",
      dateTime: formatDisplayDate(now),
      actions: input.actions ?? "View details",
    })
    .returning();

  return row;
}
