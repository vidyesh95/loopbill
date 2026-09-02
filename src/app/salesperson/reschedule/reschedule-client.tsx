"use client";

import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {rescheduleService} from "@/lib/actions/ops";

type QueueItem = {
    id: number;
    serviceId: number | null;
    customer: string | null;
    phone: string | null;
    customerPhone: string | null;
    reason: string | null;
    requestedDate: string | null;
    status: string;
    source: string;
    currentDate: string | null;
    rescheduleCount: number | null;
};

export default function RescheduleClient({
    queue,
    agents,
}: {
    queue: QueueItem[];
    agents: Array<{id: string; name: string}>;
}) {
    const router = useRouter();

    return (
        <main className="flex flex-col gap-4">
            <div>
                <h1 className="text-2xl font-bold">Reschedule</h1>
                <p className="text-muted-foreground">Agent absences and customer requests. Max 2 reschedules unless admin overrides.</p>
            </div>
            {queue.map((item) => (
                <form
                    key={item.id}
                    className="grid gap-3 rounded-md border p-4 md:grid-cols-4"
                    action={async (formData) => {
                        if (!item.serviceId) {
                            toast.error("No linked service");
                            return;
                        }
                        const result = await rescheduleService({
                            serviceId: item.serviceId,
                            date: String(formData.get("date") || ""),
                            agentId: String(formData.get("agentId") || "") || undefined,
                        });
                        if (!result.ok) {
                            toast.error(result.error);
                            return;
                        }
                        toast.success("Rescheduled");
                        router.refresh();
                    }}
                >
                    <div className="md:col-span-4 text-sm">
                        <strong>{item.customer ?? item.phone ?? "Unknown"}</strong> · {item.source} · {item.reason}
                        <div className="text-muted-foreground">
                            Current: {item.currentDate ?? "—"} · reschedules used: {item.rescheduleCount ?? 0}
                        </div>
                    </div>
                    <Input name="date" type="date" defaultValue={item.requestedDate ?? ""} required />
                    <select name="agentId" className="h-10 rounded-md border px-3 text-sm">
                        <option value="">Keep agent</option>
                        {agents.map((agent) => (
                            <option key={agent.id} value={agent.id}>
                                {agent.name}
                            </option>
                        ))}
                    </select>
                    <Button type="submit" disabled={item.status !== "pending" || !item.serviceId}>
                        Schedule new date
                    </Button>
                </form>
            ))}
            {queue.length === 0 ? <p className="text-muted-foreground">Queue is empty.</p> : null}
        </main>
    );
}
