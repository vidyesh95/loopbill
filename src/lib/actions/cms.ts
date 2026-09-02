"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { siteContent, sitePricing, siteService } from "@/lib/db/schema";
import { fail, okEmpty, requireActionRole, type ActionResult } from "@/lib/actions/_guard";

function revalidateSite() {
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/residential");
  revalidatePath("/commercial");
  revalidatePath("/terms");
  revalidatePath("/admin/website");
}

export async function upsertSiteService(input: {
  id?: number;
  slug: string;
  title: string;
  category: "pest" | "other";
  summary: string;
  details: string[];
  sort?: number;
  published?: boolean;
}): Promise<ActionResult> {
  await requireActionRole(["admin"]);
  if (!input.slug || !input.title) {
    return fail("Slug and title are required");
  }
  const values = {
    slug: input.slug,
    title: input.title,
    category: input.category,
    summary: input.summary,
    details: JSON.stringify(input.details),
    sort: input.sort ?? 0,
    published: input.published ?? true,
  };
  if (input.id) {
    await db.update(siteService).set(values).where(eq(siteService.id, input.id));
  } else {
    await db.insert(siteService).values(values);
  }
  revalidateSite();
  return okEmpty();
}

export async function upsertSitePricing(input: {
  id?: number;
  slug: string;
  label: string;
  residentialBase: number;
  commercialPerSqft: number;
}): Promise<ActionResult> {
  await requireActionRole(["admin"]);
  const values = {
    slug: input.slug,
    label: input.label,
    residentialBase: input.residentialBase,
    commercialPerSqft: input.commercialPerSqft,
  };
  if (input.id) {
    await db.update(sitePricing).set(values).where(eq(sitePricing.id, input.id));
  } else {
    await db.insert(sitePricing).values(values);
  }
  revalidateSite();
  return okEmpty();
}

export async function upsertSiteContent(key: string, value: unknown): Promise<ActionResult> {
  await requireActionRole(["admin"]);
  const serialized = typeof value === "string" ? value : JSON.stringify(value);
  await db
    .insert(siteContent)
    .values({ key, value: serialized })
    .onConflictDoUpdate({ target: siteContent.key, set: { value: serialized } });
  revalidateSite();
  return okEmpty();
}
