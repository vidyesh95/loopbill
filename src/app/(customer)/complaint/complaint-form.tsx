"use client";

import {useState} from "react";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {submitPublicComplaint} from "@/lib/actions/public";
import {COMPLAINT_TYPES} from "@/lib/data/status";

export default function ComplaintForm() {
    const [pending, setPending] = useState(false);

    return (
        <form
            className="space-y-3"
            action={async (formData) => {
                setPending(true);
                const result = await submitPublicComplaint({
                    phone: String(formData.get("phone") || ""),
                    issue: String(formData.get("issue") || ""),
                    complaintType: String(formData.get("complaintType") || "Service quality"),
                });
                setPending(false);
                if (!result.ok) {
                    toast.error(result.error);
                    return;
                }
                toast.success(`Complaint #${result.data.id} received. We will follow up.`);
            }}
        >
            <div className="space-y-1">
                <Label>Phone</Label>
                <Input name="phone" required placeholder="+91 98765 43210" />
            </div>
            <div className="space-y-1">
                <Label>Type</Label>
                <select name="complaintType" className="h-10 w-full rounded-md border px-3 text-sm">
                    {COMPLAINT_TYPES.map((item) => (
                        <option key={item}>{item}</option>
                    ))}
                </select>
            </div>
            <div className="space-y-1">
                <Label>What went wrong?</Label>
                <Textarea name="issue" required />
            </div>
            <Button type="submit" disabled={pending} className="w-full">
                {pending ? "Sending..." : "Submit complaint"}
            </Button>
        </form>
    );
}
