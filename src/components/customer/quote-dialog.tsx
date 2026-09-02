"use client";

import {useState, type ReactNode} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {QuoteForm, type QuoteFormProps} from "@/components/customer/quote-form";

type QuoteDialogProps = QuoteFormProps & {
    trigger: ReactNode;
    title?: string;
    description?: string;
};

export function QuoteDialog({
    trigger,
    title = "Get a free quote",
    description = "Tell us about the property and the service you need. We’ll call or WhatsApp you back.",
    ...formProps
}: QuoteDialogProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <QuoteForm {...formProps} onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}
