import Link from "next/link";

const reasons = [
    {
        title: "Two rate cards, one crew",
        description:
            "Homes pay by BHK. Offices and kitchens pay by square feet. Both can choose One Time, 1 Year, or 2 Year.",
    },
    {
        title: "The pests Mumbai actually has",
        description:
            "Bedbug, cockroach, mosquito, rodent, termite, and wood borer — plus invisible grill, bird proofing, and rat guard.",
    },
    {
        title: "Book the way you already talk",
        description:
            "Call +91 86001 39094, send a WhatsApp, or leave a quote. We confirm the visit before anyone arrives.",
    },
];

export default function Features() {
    return (
        <section className="bg-[oklch(0.965_0.012_95)] py-20">
            <header className="mx-auto mb-12 max-w-2xl px-4 text-center">
                <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                    Why Urban Pest Master
                </p>
                <h2 className="font-display mt-3 text-3xl md:text-4xl">
                    Built around homes and AMCs, not monthly software plans
                </h2>
            </header>

            <ul className="mx-auto grid max-w-6xl gap-4 px-4 md:grid-cols-3">
                {reasons.map(({title, description}) => (
                    <li
                        key={title}
                        className="rounded-2xl border border-[oklch(0.86_0.015_95)] bg-[oklch(0.99_0.008_95)] p-6"
                    >
                        <h3 className="text-xl font-semibold">{title}</h3>
                        <p className="mt-3 text-muted-foreground">{description}</p>
                    </li>
                ))}
            </ul>

            <p className="mt-10 text-center text-sm text-muted-foreground">
                <Link href="/residential" className="text-primary underline-offset-4 hover:underline">
                    Residential
                </Link>
                {" · "}
                <Link href="/commercial" className="text-primary underline-offset-4 hover:underline">
                    Commercial
                </Link>
            </p>
        </section>
    );
}
