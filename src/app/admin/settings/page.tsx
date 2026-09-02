import { db } from "@/lib/db";
import { branch, company, sitePricing } from "@/lib/db/schema";
import { getSettingsMap } from "@/lib/db/settings";
import SettingsClient from "./settings-client";

export default async function Settings() {
  const [companyRow] = await db.select().from(company).limit(1);
  const branches = companyRow ? await db.select().from(branch) : [];
  const settings = await getSettingsMap();
  const pricing = await db.select().from(sitePricing);

  return (
    <SettingsClient
      company={{
        name: companyRow?.name ?? "",
        address: companyRow?.address ?? "",
        email: companyRow?.email ?? "",
        phone: companyRow?.phone ?? "",
      }}
      branches={branches.map((item) => ({ id: item.id, name: item.name, address: item.address }))}
      remindersEnabled={settings.remindersEnabled !== "false"}
      maxReschedules={Number(settings.maxReschedules ?? 2)}
      officeHours={settings.officeHours ?? "Mon–Sat 9:00 AM – 7:00 PM"}
      channelEmail={settings.channelEmail !== "false"}
      channelSms={settings.channelSms !== "false"}
      channelWhatsapp={settings.channelWhatsapp !== "false"}
      channelPush={settings.channelPush === "true"}
      pricing={pricing.map((item) => ({
        id: item.id,
        slug: item.slug,
        label: item.label,
        residentialBase: item.residentialBase,
        commercialPerSqft: item.commercialPerSqft,
      }))}
    />
  );
}
