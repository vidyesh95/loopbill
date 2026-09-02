"use client";

import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {convertLeadToCustomer, updateLeadStatus} from "@/lib/actions/leads";
import {LEAD_STATUSES} from "@/lib/data/status";

type Lead = {
    id: number;
    name: string;
    email: string;
    phone: string;
    propertyType: string;
    service: string;
    message: string;
    source: string;
    status: string;
    createdAt: Date;
};

export default function LeadsClient({leads, title}: {leads: Lead[]; title: string}) {
    const router = useRouter();

    return (
        <main className="flex w-full flex-col gap-4">
            <div>
                <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
                <p className="text-muted-foreground">Enquiries from the consumer website</p>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {leads.map((lead) => (
                        <TableRow key={lead.id}>
                            <TableCell>
                                <div className="font-medium">{lead.name}</div>
                                <div className="text-xs text-muted-foreground">{lead.source}</div>
                            </TableCell>
                            <TableCell>
                                {lead.phone}
                                <div className="text-xs text-muted-foreground">{lead.email}</div>
                            </TableCell>
                            <TableCell>
                                {lead.service} · {lead.propertyType}
                            </TableCell>
                            <TableCell>
                                <select
                                    className="h-9 rounded-md border px-2 text-sm"
                                    defaultValue={lead.status}
                                    onChange={async (event) => {
                                        const result = await updateLeadStatus(lead.id, event.target.value);
                                        if (!result.ok) {
                                            toast.error(result.error);
                                            return;
                                        }
                                        toast.success("Lead updated");
                                        router.refresh();
                                    }}
                                >
                                    {LEAD_STATUSES.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </TableCell>
                            <TableCell>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={lead.status === "converted"}
                                    onClick={async () => {
                                        const result = await convertLeadToCustomer(lead.id);
                                        if (!result.ok) {
                                            toast.error(result.error);
                                            return;
                                        }
                                        toast.success("Converted to customer");
                                        router.refresh();
                                    }}
                                >
                                    Convert
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {leads.length === 0 ? <p className="text-sm text-muted-foreground">No leads yet.</p> : null}
        </main>
    );
}
