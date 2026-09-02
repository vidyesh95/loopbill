"use server";

import {mkdir, writeFile} from "node:fs/promises";
import path from "node:path";
import {revalidatePath} from "next/cache";
import {eq} from "drizzle-orm";
import {db} from "@/lib/db";
import {contract, customer, rescheduleRequest, service, serviceProof} from "@/lib/db/schema";
import {fail, okEmpty, requireActionRole, type ActionResult} from "@/lib/actions/_guard";
import {dispatchNotification} from "@/lib/notifications/dispatch";
import {assertServiceDate} from "@/lib/lifecycle";

function revalidateAgent() {
    revalidatePath("/agent");
    revalidatePath("/agent/schedule");
    revalidatePath("/agent/servicemap");
    revalidatePath("/salesperson/reschedule");
    revalidatePath("/admin/services");
}

export async function completeAssignedService(input: {
    serviceId: number;
    notes?: string;
    override?: boolean;
}): Promise<ActionResult> {
    const session = await requireActionRole(["agent", "admin"]);
    const [row] = await db.select().from(service).where(eq(service.id, input.serviceId)).limit(1);
    if (!row) {
        return fail("Job not found");
    }
    if (session.user.role === "agent" && row.agentId !== session.user.id) {
        return fail("This job is not assigned to you");
    }

    const contractRow = row.contractId
        ? (await db.select().from(contract).where(eq(contract.id, row.contractId)).limit(1))[0]
        : undefined;
    const proposedDate = row.scheduledAt ?? new Date();
    const allowOverride = session.user.role === "admin" && Boolean(input.override);
    const previous = row.contractId
        ? (
              await db.select().from(service).where(eq(service.contractId, row.contractId))
          ).find((item) => item.status === "Completed" && item.serviceNumber < row.serviceNumber)
        : undefined;

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
            status: "Completed",
            completionNotes: input.notes,
            completedAt: new Date(),
        })
        .where(eq(service.id, row.id));

    const [customerRow] = await db.select().from(customer).where(eq(customer.id, row.customerId)).limit(1);
    await dispatchNotification({
        subject: `Service completed — ${row.serviceType}`,
        recipients: customerRow?.name ?? `Customer #${row.customerId}`,
        type: "Service Completion",
        methods: ["WhatsApp", "SMS", "Email"],
        phone: customerRow?.phone,
    });

    revalidateAgent();
    return okEmpty();
}

export async function reportCustomerAbsence(serviceId: number, reason?: string): Promise<ActionResult> {
    const session = await requireActionRole(["agent", "admin"]);
    const [row] = await db.select().from(service).where(eq(service.id, serviceId)).limit(1);
    if (!row) {
        return fail("Job not found");
    }
    if (session.user.role === "agent" && row.agentId !== session.user.id) {
        return fail("This job is not assigned to you");
    }

    const now = new Date();
    await db
        .update(service)
        .set({
            status: "Reschedule required",
            absenceReportedAt: now,
            notes: reason ?? row.notes,
        })
        .where(eq(service.id, serviceId));

    await db.insert(rescheduleRequest).values({
        serviceId,
        customerId: row.customerId,
        reason: reason ?? "Customer not present",
        status: "pending",
        source: "agent",
        createdAt: now,
    });

    const [customerRow] = await db.select().from(customer).where(eq(customer.id, row.customerId)).limit(1);
    await dispatchNotification({
        subject: `Absence reported — service #${row.id}`,
        recipients: customerRow?.name ?? `Customer #${row.customerId}`,
        type: "Reschedule Required",
        methods: ["WhatsApp", "SMS"],
        phone: customerRow?.phone,
        actions: "Reschedule",
    });

    revalidateAgent();
    return okEmpty();
}

export async function uploadServiceProof(formData: FormData): Promise<ActionResult<{url: string}>> {
    const session = await requireActionRole(["agent", "admin"]);
    const serviceId = Number(formData.get("serviceId"));
    const file = formData.get("file");
    if (!serviceId || !(file instanceof File) || file.size === 0) {
        return fail("Choose a photo to upload");
    }

    const [row] = await db.select().from(service).where(eq(service.id, serviceId)).limit(1);
    if (!row) {
        return fail("Job not found");
    }
    if (session.user.role === "agent" && row.agentId !== session.user.id) {
        return fail("This job is not assigned to you");
    }

    const dir = path.join(process.cwd(), "public/uploads/proof");
    await mkdir(dir, {recursive: true});
    const ext = path.extname(file.name) || ".jpg";
    const filename = `${serviceId}-${Date.now()}${ext}`;
    await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
    const url = `/uploads/proof/${filename}`;

    await db.insert(serviceProof).values({
        serviceId,
        url,
        createdAt: new Date(),
    });

    revalidateAgent();
    return {ok: true, data: {url}};
}
