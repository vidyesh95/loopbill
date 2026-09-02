"use client";

import {MessageCircle} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {whatsappUrl} from "@/lib/data/services";

const INTENTS = [
    {label: "Latest offers and discount", message: "I want to know about latest offers and discounts."},
    {label: "Instant cockroach service", message: "I need instant cockroach service."},
    {label: "Bedbug control", message: "I need bedbug control."},
    {label: "Termite control", message: "I need termite control."},
    {label: "Rodent control", message: "I need rodent control."},
    {label: "Wood borer control", message: "I need wood borer control."},
    {label: "Mosquito control", message: "I need mosquito control."},
    {label: "Price", message: "I want a price for pest control."},
    {label: "Service booking", message: "I want to book a pest control service."},
    {label: "Complaint", message: "I want to raise a complaint about a recent service."},
] as const;

export function WhatsappWidget() {
    return (
        <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-full border-[oklch(0.78_0.02_95)] bg-[oklch(0.99_0.008_95)] px-4 shadow-lg"
                    >
                        <MessageCircle className="size-4" />
                        Enquire
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-md">
                    <SheetHeader>
                        <SheetTitle>Message Urban Pest Master</SheetTitle>
                        <SheetDescription>
                            Pick a topic. We open WhatsApp with the message ready to send.
                        </SheetDescription>
                    </SheetHeader>
                    <ul className="mt-4 space-y-2 px-4 pb-6">
                        {INTENTS.map((intent) => (
                            <li key={intent.label}>
                                <a
                                    href={whatsappUrl(intent.message)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block rounded-xl border border-[oklch(0.86_0.015_95)] px-4 py-3 text-sm hover:border-primary hover:bg-[oklch(0.965_0.012_95)]"
                                >
                                    {intent.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </SheetContent>
            </Sheet>

            <a
                href={whatsappUrl()}
                target="_blank"
                rel="noreferrer"
                className="flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition hover:scale-105"
                aria-label="Chat on WhatsApp"
            >
                <WhatsAppIcon />
            </a>
        </div>
    );
}

function WhatsAppIcon() {
    return (
        <svg viewBox="0 0 24 24" className="size-7 fill-current" aria-hidden="true">
            <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.33 4.94L2 22l5.39-1.41a10.1 10.1 0 0 0 4.65 1.13h.01c5.46 0 9.89-4.4 9.89-9.83S17.5 2 12.04 2m0 17.96h-.01a8.4 8.4 0 0 1-4.28-1.17l-.31-.18-3.2.84.85-3.11-.2-.32a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.72-8.23 8.3-8.23 4.57 0 8.29 3.69 8.29 8.23s-3.72 8.3-8.18 8.3m4.55-6.2c-.25-.12-1.47-.72-1.7-.81-.23-.08-.4-.12-.56.13-.17.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.24-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.24-.87.85-.87 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.24 3.74 1.49.64 2.08.7 2.83.59.43-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.17-.48-.29" />
        </svg>
    );
}
