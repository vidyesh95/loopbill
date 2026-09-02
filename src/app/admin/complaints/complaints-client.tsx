"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import ComplaintsTable from "@/components/admin/complaints/complaints-table";
import {ComplaintDialog} from "@/components/staff/staff-forms";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {assignRedo, attendComplaint, resolveComplaint} from "@/lib/actions/ops";
import type {ComplaintRow} from "@/lib/data/types";
import {formString} from "@/lib/utils";

export default function ComplaintsClient({
    complaints,
    customers,
    services,
    canAssignRedo,
    agents = [],
}: {
    complaints: ComplaintRow[];
    customers: Array<{id: number; name: string}>;
    services: Array<{id: number; customerId: number; label: string}>;
    canAssignRedo?: boolean;
    agents?: Array<{id: string; name: string}>;
}) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [redoId, setRedoId] = useState<number | null>(null);

    async function handleAttend(id: number) {
        const result = await attendComplaint(id);
        if (!result.ok) {
            toast.error(result.error);
            return;
        }
        toast.success("Complaint marked attended");
        router.refresh();
    }

    async function handleResolve(id: number) {
        const result = await resolveComplaint(id);
        if (!result.ok) {
            toast.error(result.error);
            return;
        }
        toast.success("Complaint resolved");
        router.refresh();
    }

    return (
        <main className="flex w-full flex-col gap-4">
            <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold md:text-3xl">Complaints</h1>
                    <p className="text-muted-foreground">Track and resolve customer complaints</p>
                </div>
                <Button className="cursor-pointer" onClick={() => setOpen(true)}>
                    <Plus />
                    Add complaint
                </Button>
            </div>
            <ComplaintsTable complaints={complaints} />
            {canAssignRedo ? (
                <div className="flex flex-wrap gap-2">
                    {complaints
                        .filter((item) => item.status !== "Resolved")
                        .slice(0, 8)
                        .map((item) => (
                            <div key={item.complaintId} className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                                #{item.complaintId} {item.customer}
                                <Button size="sm" variant="outline" onClick={() => handleAttend(item.complaintId)}>
                                    Attend
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleResolve(item.complaintId)}>
                                    Resolve
                                </Button>
                                <Button size="sm" onClick={() => setRedoId(item.complaintId)}>
                                    Assign redo
                                </Button>
                            </div>
                        ))}
                </div>
            ) : null}
            <ComplaintDialog open={open} onOpenChange={setOpen} customers={customers} services={services} />
            <Dialog open={redoId !== null} onOpenChange={(next) => !next && setRedoId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign redo</DialogTitle>
                    </DialogHeader>
                    <form
                        className="space-y-3"
                        action={async (formData) => {
                            if (redoId === null) {
                                return;
                            }
                            const result = await assignRedo({
                                complaintId: redoId,
                                agentId: formString(formData, "agentId"),
                                date: formString(formData, "date"),
                                override: formData.get("override") === "on",
                            });
                            if (!result.ok) {
                                toast.error(result.error);
                                return;
                            }
                            toast.success("Redo assigned");
                            setRedoId(null);
                            router.refresh();
                        }}
                    >
                        <div className="space-y-1">
                            <Label>Agent</Label>
                            <select name="agentId" required className="h-10 w-full rounded-md border px-3 text-sm">
                                {agents.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <Label>Date</Label>
                            <Input name="date" type="date" required />
                        </div>
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" name="override" />
                            Override redo cooldown / one-redo limit
                        </label>
                        <Button type="submit" className="w-full">
                            Assign
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </main>
    );
}
