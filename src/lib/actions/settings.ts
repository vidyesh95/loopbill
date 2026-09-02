"use server";

import {revalidatePath} from "next/cache";
import {eq} from "drizzle-orm";
import {db} from "@/lib/db";
import {branch, company, notificationTemplate} from "@/lib/db/schema";
import {fail, ok, okEmpty, requireActionRole, type ActionResult} from "@/lib/actions/_guard";
import {setSettings} from "@/lib/db/settings";
import {runLifecycleTick, type LifecycleTickResult} from "@/lib/lifecycle-jobs";

export async function updateCompanySettings(input: {
    name: string;
    address: string;
    email: string;
    phone: string;
    branches: Array<{id?: number; name: string; address: string}>;
}): Promise<ActionResult> {
    await requireActionRole(["admin"]);
    const [existing] = await db.select().from(company).limit(1);
    if (existing) {
        await db
            .update(company)
            .set({
                name: input.name,
                address: input.address,
                email: input.email,
                phone: input.phone,
            })
            .where(eq(company.id, existing.id));
    } else {
        await db.insert(company).values(input);
    }

    const companyRow = existing ?? (await db.select().from(company).limit(1))[0];
    if (companyRow) {
        const current = await db.select().from(branch).where(eq(branch.companyId, companyRow.id));
        const keepIds = input.branches.map((item) => item.id).filter((id): id is number => Boolean(id));
        for (const row of current) {
            if (!keepIds.includes(row.id)) {
                await db.delete(branch).where(eq(branch.id, row.id));
            }
        }
        for (const item of input.branches) {
            if (item.id) {
                await db
                    .update(branch)
                    .set({name: item.name, address: item.address})
                    .where(eq(branch.id, item.id));
            } else {
                await db.insert(branch).values({
                    companyId: companyRow.id,
                    name: item.name,
                    address: item.address,
                });
            }
        }
    }

    revalidatePath("/admin/settings");
    revalidatePath("/");
    return okEmpty();
}

export async function updateAppSettings(input: {
    remindersEnabled: boolean;
    maxReschedules: number;
    officeHours: string;
}): Promise<ActionResult> {
    await requireActionRole(["admin"]);
    await setSettings({
        remindersEnabled: String(input.remindersEnabled),
        maxReschedules: String(input.maxReschedules),
        officeHours: input.officeHours,
    });
    revalidatePath("/admin/settings");
    return okEmpty();
}

export async function runDailyJobsAction(): Promise<ActionResult<LifecycleTickResult>> {
    await requireActionRole(["admin"]);
    const result = await runLifecycleTick();
    revalidatePath("/admin");
    revalidatePath("/admin/notifications");
    revalidatePath("/admin/contracts");
    return ok(result);
}

export async function upsertNotificationTemplate(input: {
    id?: number;
    cardTitle: string;
    cardDescription: string;
    subject: string;
    message: string;
}): Promise<ActionResult> {
    await requireActionRole(["admin"]);
    if (!input.cardTitle || !input.subject || !input.message) {
        return fail("Template fields are required");
    }
    if (input.id) {
        await db
            .update(notificationTemplate)
            .set({
                cardTitle: input.cardTitle,
                cardDescription: input.cardDescription,
                subject: input.subject,
                message: input.message,
            })
            .where(eq(notificationTemplate.id, input.id));
    } else {
        await db.insert(notificationTemplate).values(input);
    }
    revalidatePath("/admin/notifications");
    return okEmpty();
}
