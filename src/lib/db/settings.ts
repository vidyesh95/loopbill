import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { appSetting } from "@/lib/db/schema";

export async function getSetting(key: string, fallback = "") {
  const [row] = await db.select().from(appSetting).where(eq(appSetting.key, key)).limit(1);
  return row?.value ?? fallback;
}

export async function getSettingNumber(key: string, fallback: number) {
  const value = Number(await getSetting(key, String(fallback)));
  return Number.isFinite(value) ? value : fallback;
}

export async function getSettingsMap() {
  const rows = await db.select().from(appSetting);
  return Object.fromEntries(rows.map((row) => [row.key, row.value]));
}

export async function setSettings(entries: Record<string, string>) {
  for (const [key, value] of Object.entries(entries)) {
    await db
      .insert(appSetting)
      .values({ key, value })
      .onConflictDoUpdate({ target: appSetting.key, set: { value } });
  }
}
