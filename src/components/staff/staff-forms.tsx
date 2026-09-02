"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {createComplaint, createContract, scheduleService, sendManualNotification, upsertCustomer} from "@/lib/actions/ops";
import {COMPLAINT_PRIORITIES, COMPLAINT_TYPES, PAYMENT_FREQUENCIES, PAYMENT_STATUSES} from "@/lib/data/status";

export type LookupCustomer = {id: number; name: string; phone?: string | null};
export type LookupAgent = {id: string; name: string};
export type LookupPackage = {id: number; name: string};

export function ScheduleServiceDialog({
    open,
    onOpenChange,
    customers,
    agents,
    allowOverride,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customers: LookupCustomer[];
    agents: LookupAgent[];
    allowOverride?: boolean;
}) {
    const router = useRouter();
    const [pending, setPending] = useState(false);

    async function onSubmit(formData: FormData) {
        setPending(true);
        const result = await scheduleService({
            customerId: Number(formData.get("customerId")),
            serviceType: String(formData.get("serviceType") || ""),
            date: String(formData.get("date") || ""),
            agentId: String(formData.get("agentId") || "") || undefined,
            serviceNumber: Number(formData.get("serviceNumber") || 1),
            notes: String(formData.get("notes") || "") || undefined,
            override: allowOverride && formData.get("override") === "on",
        });
        setPending(false);
        if (!result.ok) {
            toast.error(result.error);
            return;
        }
        toast.success("Service scheduled");
        onOpenChange(false);
        router.refresh();
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Schedule service</DialogTitle>
                    <DialogDescription>Assign an agent and a date inside the package window.</DialogDescription>
                </DialogHeader>
                <form action={onSubmit} className="space-y-3">
                    <Field label="Customer">
                        <select name="customerId" required className="h-10 w-full rounded-md border px-3 text-sm">
                            <option value="">Select customer</option>
                            {customers.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Service type">
                        <Input name="serviceType" required placeholder="Cockroach control" />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Date">
                            <Input name="date" type="date" required />
                        </Field>
                        <Field label="Visit">
                            <select name="serviceNumber" className="h-10 w-full rounded-md border px-3 text-sm" defaultValue="1">
                                <option value="1">1st service</option>
                                <option value="2">2nd service</option>
                                <option value="3">3rd service</option>
                            </select>
                        </Field>
                    </div>
                    <Field label="Agent">
                        <select name="agentId" className="h-10 w-full rounded-md border px-3 text-sm">
                            <option value="">Unassigned</option>
                            {agents.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Notes">
                        <Textarea name="notes" rows={3} />
                    </Field>
                    {allowOverride ? (
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" name="override" />
                            Admin override interval rules
                        </label>
                    ) : null}
                    <Button type="submit" disabled={pending} className="w-full">
                        {pending ? "Saving..." : "Schedule"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function CustomerDialog({
    open,
    onOpenChange,
    initial,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initial?: {
        id?: number;
        locationId?: number;
        name?: string;
        phone?: string;
        email?: string;
        label?: string;
        address?: string;
        building?: string;
        wing?: string;
        flatNo?: string;
    };
}) {
    const router = useRouter();
    const [pending, setPending] = useState(false);

    async function onSubmit(formData: FormData) {
        setPending(true);
        const result = await upsertCustomer({
            id: initial?.id,
            locationId: initial?.locationId,
            name: String(formData.get("name") || ""),
            phone: String(formData.get("phone") || ""),
            email: String(formData.get("email") || ""),
            label: String(formData.get("label") || ""),
            address: String(formData.get("address") || ""),
            building: String(formData.get("building") || ""),
            wing: String(formData.get("wing") || ""),
            flatNo: String(formData.get("flatNo") || ""),
        });
        setPending(false);
        if (!result.ok) {
            toast.error(result.error);
            return;
        }
        toast.success(initial?.id ? "Customer updated" : "Customer created");
        onOpenChange(false);
        router.refresh();
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{initial?.id ? "Edit customer" : "New customer"}</DialogTitle>
                    <DialogDescription>Customer profile and structured location.</DialogDescription>
                </DialogHeader>
                <form action={onSubmit} className="grid gap-3">
                    <Field label="Name">
                        <Input name="name" required defaultValue={initial?.name} />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Phone">
                            <Input name="phone" required defaultValue={initial?.phone} />
                        </Field>
                        <Field label="Email">
                            <Input name="email" type="email" defaultValue={initial?.email} />
                        </Field>
                    </div>
                    <Field label="Location label">
                        <Input name="label" required defaultValue={initial?.label} placeholder="Building A, Flat 304" />
                    </Field>
                    <Field label="Address">
                        <Textarea name="address" required defaultValue={initial?.address} />
                    </Field>
                    <div className="grid grid-cols-3 gap-3">
                        <Field label="Building">
                            <Input name="building" defaultValue={initial?.building} />
                        </Field>
                        <Field label="Wing">
                            <Input name="wing" defaultValue={initial?.wing} />
                        </Field>
                        <Field label="Flat">
                            <Input name="flatNo" defaultValue={initial?.flatNo} />
                        </Field>
                    </div>
                    <Button type="submit" disabled={pending}>
                        {pending ? "Saving..." : "Save"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function ComplaintDialog({
    open,
    onOpenChange,
    customers,
    services,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customers: LookupCustomer[];
    services: Array<{id: number; customerId: number; label: string}>;
}) {
    const router = useRouter();
    const [pending, setPending] = useState(false);

    async function onSubmit(formData: FormData) {
        setPending(true);
        const result = await createComplaint({
            customerId: Number(formData.get("customerId")),
            serviceId: Number(formData.get("serviceId")),
            complaintType: String(formData.get("complaintType") || "Service quality"),
            priority: String(formData.get("priority") || "Normal"),
            issue: String(formData.get("issue") || ""),
        });
        setPending(false);
        if (!result.ok) {
            toast.error(result.error);
            return;
        }
        toast.success("Complaint logged");
        onOpenChange(false);
        router.refresh();
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add complaint</DialogTitle>
                    <DialogDescription>Must be raised in the same month as the original service.</DialogDescription>
                </DialogHeader>
                <form action={onSubmit} className="space-y-3">
                    <Field label="Customer">
                        <select name="customerId" required className="h-10 w-full rounded-md border px-3 text-sm">
                            {customers.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Service">
                        <select name="serviceId" required className="h-10 w-full rounded-md border px-3 text-sm">
                            {services.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Type">
                            <select name="complaintType" className="h-10 w-full rounded-md border px-3 text-sm">
                                {COMPLAINT_TYPES.map((item) => (
                                    <option key={item}>{item}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Priority">
                            <select name="priority" className="h-10 w-full rounded-md border px-3 text-sm" defaultValue="Normal">
                                {COMPLAINT_PRIORITIES.map((item) => (
                                    <option key={item}>{item}</option>
                                ))}
                            </select>
                        </Field>
                    </div>
                    <Field label="Issue">
                        <Textarea name="issue" required />
                    </Field>
                    <Button type="submit" disabled={pending} className="w-full">
                        {pending ? "Saving..." : "Create complaint"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function ContractDialog({
    open,
    onOpenChange,
    customers,
    packages,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customers: LookupCustomer[];
    packages: LookupPackage[];
}) {
    const router = useRouter();
    const [pending, setPending] = useState(false);

    async function onSubmit(formData: FormData) {
        setPending(true);
        const result = await createContract({
            customerId: Number(formData.get("customerId")),
            packageId: Number(formData.get("packageId")) || undefined,
            serviceType: String(formData.get("serviceType") || ""),
            contractValue: Number(formData.get("contractValue") || 0),
            paymentStatus: String(formData.get("paymentStatus") || "Pending"),
            paymentFrequency: String(formData.get("paymentFrequency") || "Quarterly"),
            nextPayment: String(formData.get("nextPayment") || ""),
            contractDate: String(formData.get("contractDate") || ""),
            expiryDate: String(formData.get("expiryDate") || ""),
        });
        setPending(false);
        if (!result.ok) {
            toast.error(result.error);
            return;
        }
        toast.success("Contract created");
        onOpenChange(false);
        router.refresh();
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>New contract</DialogTitle>
                    <DialogDescription>Creates a 3-service package for the customer.</DialogDescription>
                </DialogHeader>
                <form action={onSubmit} className="space-y-3">
                    <Field label="Customer">
                        <select name="customerId" required className="h-10 w-full rounded-md border px-3 text-sm">
                            {customers.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Package">
                        <select name="packageId" className="h-10 w-full rounded-md border px-3 text-sm">
                            {packages.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Service type">
                        <Input name="serviceType" required />
                    </Field>
                    <Field label="Value (₹)">
                        <Input name="contractValue" type="number" required />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Payment">
                            <select name="paymentStatus" className="h-10 w-full rounded-md border px-3 text-sm">
                                {PAYMENT_STATUSES.map((item) => (
                                    <option key={item}>{item}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Frequency">
                            <select name="paymentFrequency" className="h-10 w-full rounded-md border px-3 text-sm">
                                {PAYMENT_FREQUENCIES.map((item) => (
                                    <option key={item}>{item}</option>
                                ))}
                            </select>
                        </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Start">
                            <Input name="contractDate" type="date" required />
                        </Field>
                        <Field label="Expiry">
                            <Input name="expiryDate" type="date" required />
                        </Field>
                    </div>
                    <Field label="Next payment">
                        <Input name="nextPayment" type="date" />
                    </Field>
                    <Button type="submit" disabled={pending} className="w-full">
                        {pending ? "Saving..." : "Create contract"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function NotificationDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const router = useRouter();
    const [pending, setPending] = useState(false);

    async function onSubmit(formData: FormData) {
        setPending(true);
        const methods = ["Email", "SMS", "WhatsApp", "Push"].filter((item) => formData.get(item) === "on") as Array<
            "Email" | "SMS" | "WhatsApp" | "Push"
        >;
        const result = await sendManualNotification({
            subject: String(formData.get("subject") || ""),
            recipients: String(formData.get("recipients") || ""),
            type: String(formData.get("type") || "Service Reminder"),
            methods: methods.length ? methods : ["WhatsApp", "SMS"],
        });
        setPending(false);
        if (!result.ok) {
            toast.error(result.error);
            return;
        }
        toast.success("Notification queued (placeholder send)");
        onOpenChange(false);
        router.refresh();
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Send notification</DialogTitle>
                    <DialogDescription>Writes to the notification log. WhatsApp/SMS are placeholders.</DialogDescription>
                </DialogHeader>
                <form action={onSubmit} className="space-y-3">
                    <Field label="Type">
                        <Input name="type" defaultValue="Service Reminder" />
                    </Field>
                    <Field label="Recipients">
                        <Input name="recipients" required placeholder="Customer or group name" />
                    </Field>
                    <Field label="Subject">
                        <Input name="subject" required />
                    </Field>
                    <div className="flex flex-wrap gap-3 text-sm">
                        {["WhatsApp", "SMS", "Email", "Push"].map((item) => (
                            <label key={item} className="flex items-center gap-2">
                                <input type="checkbox" name={item} defaultChecked={item !== "Push"} />
                                {item}
                            </label>
                        ))}
                    </div>
                    <Button type="submit" disabled={pending} className="w-full">
                        {pending ? "Sending..." : "Send"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function Field({label, children}: {label: string; children: React.ReactNode}) {
    return (
        <div className="space-y-1">
            <Label>{label}</Label>
            {children}
        </div>
    );
}
