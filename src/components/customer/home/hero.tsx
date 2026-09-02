import Link from "next/link";
import { Button } from "@/components/ui/button";
import { QuoteDialog } from "@/components/customer/quote-dialog";
import { COMPANY_PHONES, whatsappUrl } from "@/lib/data/services";

const primaryPhone = COMPANY_PHONES[1];

export default function Hero() {
    return (
        <header className="relative overflow-hidden bg-[oklch(0.94_0.016_95)]">
            <div
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 1px 1px, oklch(0.55 0.05 145 / 0.18) 1px, transparent 0)",
                    backgroundSize: "28px 28px",
                }}
            />
            <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-28">
                <div>
                    <p className="text-xs font-semibold tracking-[0.22em] text-primary uppercase">
                        Mumbai to Palghar · by train or bus
                    </p>
                    <h1 className="font-display mt-4 max-w-xl text-4xl leading-tight text-foreground md:text-6xl">
                        Pest-free homes and businesses,{" "}
                        <span className="italic text-primary">on your terms.</span>
                    </h1>
                    <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                        Residential rates by BHK. Commercial rates by square feet. The same
                        treatments — bedbug, cockroach, mosquito, rodent, termite, wood borer —
                        booked on a call or WhatsApp.
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <QuoteDialog
                            defaultSource="hero"
                            trigger={<Button className="btn-primary">Get a free quote</Button>}
                        />
                        <Button asChild variant="outline">
                            <a href={whatsappUrl("I want to book a pest control service.")}>
                                WhatsApp {primaryPhone.display}
                            </a>
                        </Button>
                    </div>
                    <div className="mt-8 flex flex-wrap gap-3 text-sm">
                        <Link
                            href="/residential"
                            className="rounded-full border border-[oklch(0.78_0.02_95)] bg-[oklch(0.99_0.008_95)] px-4 py-2 hover:border-primary"
                        >
                            Residential rates
                        </Link>
                        <Link
                            href="/commercial"
                            className="rounded-full border border-[oklch(0.78_0.02_95)] bg-[oklch(0.99_0.008_95)] px-4 py-2 hover:border-primary"
                        >
                            Commercial rates
                        </Link>
                    </div>
                </div>

                <aside className="rounded-3xl border border-[oklch(0.78_0.02_95)] bg-[oklch(0.3_0.04_145)] p-8 text-[oklch(0.95_0.012_95)] shadow-[0_30px_60px_-32px_oklch(0.25_0.04_145)]">
                    <p className="text-xs tracking-[0.2em] uppercase opacity-70">How we work</p>
                    <ol className="mt-6 space-y-5">
                        {[
                            ["Inspect", "We walk the rooms, shafts, and wet areas before any chemical goes down."],
                            ["Treat", "A few hours on site, sized to the house or the floor plate."],
                            ["Clear", "We leave the space usable and tell you exactly what happens next."],
                        ].map(([title, body], index) => (
                            <li key={title} className="border-b border-white/10 pb-5 last:border-0 last:pb-0">
                                <p className="text-xs tracking-[0.16em] uppercase opacity-60">0{index + 1}</p>
                                <h2 className="font-display mt-1 text-2xl">{title}</h2>
                                <p className="mt-1 text-sm text-[oklch(0.84_0.02_95)]">{body}</p>
                            </li>
                        ))}
                    </ol>
                </aside>
            </div>
        </header>
    );
}
