import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { notification, notificationTemplate } from "@/lib/db/schema";
import { formatDisplayDate } from "@/lib/lifecycle";
import { getSettingsMap } from "@/lib/db/settings";

export type NotificationChannel = "Email" | "SMS" | "WhatsApp" | "Push";

const CHANNEL_KEYS: Record<NotificationChannel, string> = {
  Email: "channelEmail",
  SMS: "channelSms",
  WhatsApp: "channelWhatsapp",
  Push: "channelPush",
};

export function applyTemplate(text: string, vars: Record<string, string | number | undefined>) {
  return text.replace(/\{([a-z_]+)\}/gi, (_, key: string) => {
    const value = vars[key];
    return value === undefined || value === null ? `{${key}}` : String(value);
  });
}

export async function dispatchNotification(input: {
  subject: string;
  recipients: string;
  type: string;
  methods?: NotificationChannel[];
  status?: "Delivered" | "Sending" | "Scheduled";
  actions?: string;
  phone?: string | null;
  message?: string;
  vars?: Record<string, string | number | undefined>;
}) {
  const settings = await getSettingsMap();
  const requested = input.methods ?? ["WhatsApp", "SMS"];
  const methods = requested.filter((channel) => {
    const key = CHANNEL_KEYS[channel];
    if (channel === "Push") {
      return settings[key] === "true";
    }
    return settings[key] !== "false";
  });
  const effective = methods.length > 0 ? methods : requested;
  const method = effective.join(", ");
  const now = new Date();

  let subject = input.subject;
  let message = input.message ?? input.subject;
  if (input.vars) {
    const [template] = await db
      .select()
      .from(notificationTemplate)
      .where(eq(notificationTemplate.cardTitle, input.type))
      .limit(1);
    if (template) {
      subject = applyTemplate(template.subject, input.vars);
      message = applyTemplate(template.message, input.vars);
    } else {
      subject = applyTemplate(subject, input.vars);
      message = applyTemplate(message, input.vars);
    }
  }

  for (const channel of effective) {
    const target = input.phone ? `${input.recipients} <${input.phone}>` : input.recipients;
    console.log(`would send ${channel} to ${target}: ${subject}`);
  }

  const [row] = await db
    .insert(notification)
    .values({
      subject,
      recipients: input.recipients,
      type: input.type,
      method,
      status: input.status ?? "Delivered",
      dateTime: formatDisplayDate(now),
      actions: input.actions ?? "View details",
      message,
    })
    .returning();

  return row;
}
