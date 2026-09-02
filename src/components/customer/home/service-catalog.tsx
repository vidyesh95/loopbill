import Link from "next/link";
import type {ComponentType} from "react";
import {Button} from "@/components/ui/button";
import {QuoteDialog} from "@/components/customer/quote-dialog";
import {
    BedbugIcon,
    BirdProofingIcon,
    CockroachIcon,
    InvisibleGrillIcon,
    MosquitoIcon,
    RatGuardIcon,
    RodentIcon,
    TermiteIcon,
    WoodBorerIcon,
} from "@/components/icons/service-icons";
import {isPricedServiceSlug} from "@/lib/data/pricing";
import {OTHER_SERVICES, PEST_SERVICES} from "@/lib/data/services";

const ICONS: Record<string, ComponentType<{className?: string}>> = {
    bedbug: BedbugIcon,
    cockroach: CockroachIcon,
    mosquito: MosquitoIcon,
    rodent: RodentIcon,
    termite: TermiteIcon,
    "wood-borer": WoodBorerIcon,
    "invisible-grill": InvisibleGrillIcon,
    "bird-proofing": BirdProofingIcon,
    "rat-guard": RatGuardIcon,
};

function ServiceCard({
    slug,
    title,
    summary,
}: {
    slug: string;
    title: string;
    summary: string;
}) {
    const Icon = ICONS[slug];
    const priced = isPricedServiceSlug(slug);

    return (
        <li className="flex flex-col rounded-2xl border border-[oklch(0.86_0.015_95)] bg-[oklch(0.99_0.008_95)] p-6">
            {Icon ? <Icon className="mb-4 size-6 text-primary" /> : null}
            <h3 className="text-xl font-semibold">
                <Link href={`/services/${slug}`} className="hover:text-primary">
                    {title}
                </Link>
            </h3>
            <p className="mt-2 mb-6 flex-1 text-muted-foreground">{summary}</p>
            <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline">
                    <Link href={`/services/${slug}`}>Learn more</Link>
                </Button>
                {priced ? (
                    <Button asChild className="btn-primary">
                        <Link href={`/residential?service=${slug}`}>See price</Link>
                    </Button>
                ) : (
                    <QuoteDialog
                        defaultService={slug}
                        defaultSource={`service:${slug}`}
                        trigger={<Button className="btn-primary">Get a quote</Button>}
                    />
                )}
            </div>
        </li>
    );
}

export function ServiceCatalog() {
    return (
        <section id="services" className="bg-[oklch(0.99_0.008_95)] py-20">
            <header className="mx-auto mb-12 max-w-2xl px-4 text-center">
                <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                    Catalog
                </p>
                <h2 className="font-display mt-3 text-3xl md:text-4xl">
                    Pest-free living starts here
                </h2>
                <p className="mt-3 text-muted-foreground">
                    Six treatments with a published rate, and three proofing jobs quoted on site.
                </p>
            </header>

            <div className="mx-auto max-w-6xl px-4">
                <h3 className="mb-6 text-sm font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                    Pest control
                </h3>
                <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {PEST_SERVICES.map((service) => (
                        <ServiceCard key={service.slug} {...service} />
                    ))}
                </ul>

                <h3 className="mt-14 mb-6 text-sm font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                    Other services
                </h3>
                <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {OTHER_SERVICES.map((service) => (
                        <ServiceCard key={service.slug} {...service} />
                    ))}
                </ul>
            </div>
        </section>
    );
}
