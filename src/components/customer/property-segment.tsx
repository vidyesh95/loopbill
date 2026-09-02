import Link from "next/link";
import {PriceCalculator} from "@/components/customer/price-calculator";
import {QuoteDialog} from "@/components/customer/quote-dialog";
import {Button} from "@/components/ui/button";
import {whatsappUrl, type PropertyType} from "@/lib/data/services";

const PROCESS = [
    {
        title: "Inspect",
        body: "We come to you, walk the site, and plan the treatment around how the space is used.",
    },
    {
        title: "Treat",
        body: "The visit usually takes a few hours, depending on size and how far the infestation has spread.",
    },
    {
        title: "Clear",
        body: "We handle the cleanup after disinfection so you are not left with residue or guesswork.",
    },
];

const TRUST = [
    {title: "Certified technicians", body: "Trained crews for homes, societies, kitchens, and offices."},
    {title: "Targeted treatments", body: "Gel baits, termiticides, fogging, and exclusion — not a single spray for every pest."},
    {title: "Family- and staff-safe", body: "Approved chemicals, protective gear, and instructions before we leave."},
    {title: "AMC or one-time", body: "Same pest types, different visit rhythm. 1 Year and 2 Year plans sit on the published rate card."},
];

type PropertySegmentProps = {
    propertyType: PropertyType;
    eyebrow: string;
    title: string;
    lede: string;
    defaultService?: string;
};

export function PropertySegment({
    propertyType,
    eyebrow,
    title,
    lede,
    defaultService,
}: PropertySegmentProps) {
    const otherType = propertyType === "Residential" ? "Commercial" : "Residential";
    const otherHref = propertyType === "Residential" ? "/commercial" : "/residential";

    return (
        <main>
            <header className="bg-[oklch(0.94_0.016_95)] px-4 py-20">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                        {eyebrow}
                    </p>
                    <h1 className="font-display mt-3 text-4xl text-foreground md:text-5xl">{title}</h1>
                    <p className="mt-4 text-lg text-muted-foreground">{lede}</p>
                    <p className="mt-4 text-sm text-muted-foreground">
                        Looking for {otherType.toLowerCase()} rates?{" "}
                        <Link href={otherHref} className="text-primary underline-offset-4 hover:underline">
                            Open {otherType}
                        </Link>
                    </p>
                </div>
            </header>

            <section className="mx-auto max-w-3xl px-4 py-16">
                <PriceCalculator
                    propertyType={propertyType}
                    defaultService={defaultService}
                    source={`${propertyType.toLowerCase()}-page`}
                />
            </section>

            <section className="border-y border-[oklch(0.86_0.015_95)] bg-[oklch(0.99_0.008_95)] py-16">
                <div className="mx-auto max-w-6xl px-4">
                    <h2 className="font-display mb-10 text-center text-3xl">How a visit works</h2>
                    <ol className="grid gap-4 md:grid-cols-3">
                        {PROCESS.map((step, index) => (
                            <li
                                key={step.title}
                                className="rounded-2xl border border-[oklch(0.86_0.015_95)] bg-[oklch(0.965_0.012_95)] p-6"
                            >
                                <p className="text-xs tracking-[0.18em] text-primary uppercase">
                                    0{index + 1}
                                </p>
                                <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                                <p className="mt-2 text-muted-foreground">{step.body}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-16">
                <h2 className="font-display mb-10 text-center text-3xl">What you can expect</h2>
                <ul className="grid gap-4 md:grid-cols-2">
                    {TRUST.map((item) => (
                        <li
                            key={item.title}
                            className="rounded-2xl border border-[oklch(0.86_0.015_95)] bg-[oklch(0.99_0.008_95)] p-6"
                        >
                            <h3 className="text-lg font-semibold">{item.title}</h3>
                            <p className="mt-2 text-muted-foreground">{item.body}</p>
                        </li>
                    ))}
                </ul>
                <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                    <QuoteDialog
                        defaultPropertyType={propertyType}
                        defaultService={defaultService}
                        defaultSource={`${propertyType.toLowerCase()}-page`}
                        trigger={<Button className="btn-primary">Request a visit</Button>}
                    />
                    <Button asChild variant="outline">
                        <a href={whatsappUrl(`I need ${propertyType.toLowerCase()} pest control.`)}>
                            WhatsApp us
                        </a>
                    </Button>
                </div>
            </section>
        </main>
    );
}
