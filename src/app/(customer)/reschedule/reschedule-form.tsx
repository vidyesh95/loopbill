"use client";

import {useState} from "react";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {submitPublicReschedule} from "@/lib/actions/public";

export default function RescheduleForm() {
    const [pending, setPending] = useState(false);

    return (
        <form
            className="space-y-3"
            action={async (formData) => {
                setPending(true);
                const result = await submitPublicReschedule({
                    phone: String(formData.get("phone") || ""),
                    requestedDate: String(formData.get("requestedDate") || ""),
                    reason: String(formData.get("reason") || ""),
                });
                setPending(false);
                if (!result.ok) {
                    toast.error(result.error);
                    return;
                }
                toast.success("Request sent to Sales. We will confirm the new date.");
            }}
        >
            <div className="space-y-1">
                <Label>Phone</Label>
                <Input name="phone" required />
            </div>
            <div className="space-y-1">
                <Label>Preferred date</Label>
                <Input name="requestedDate" type="date" />
            </div>
            <div className="space-y-1">
                <Label>Reason</Label>
                <Textarea name="reason" required />
            </div>
            <Button type="submit" disabled={pending} className="w-full">
                {pending ? "Sending..." : "Send request"}
            </Button>
        </form>
    );
}
