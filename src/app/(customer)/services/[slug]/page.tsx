import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {getServiceBySlug, SERVICES} from "@/lib/data/services";
import {isPricedServiceSlug} from "@/lib/data/pricing";
import {QuoteForm} from "@/components/customer/quote-form";
import {QuoteDialog} from "@/components/customer/quote-dialog";
import {Button} from "@/components/ui/button";

type ServicePageProps = {
    params: Promise<{slug: string}>;
};

export function generateStaticParams() {
    return SERVICES.map((service) => ({slug: service.slug}));
}

export async function generateMetadata({params}: ServicePageProps): Promise<Metadata> {
    const {slug} = await params;
    const service = getServiceBySlug(slug);
    if (!service) {
        return {title: "Service | Urban Pest Master"};
    }
    return {
        title: `${service.title} | Urban Pest Master`,
        description: service.summary,
    };
}

export default async function ServicePage({params}: ServicePageProps) {
    const {slug} = await params;
    const service = getServiceBySlug(slug);
    if (!service) {
        notFound();
    }

    return (
        <main>
            <header className="bg-[oklch(0.94_0.016_95)] py-20">
                <div className="mx-auto max-w-3xl px-4 text-center">
                    <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                        {service.category === "pest" ? "Pest control" : "Other services"}
                    </p>
                    <h1 className="font-display mb-6 text-4xl text-foreground md:text-5xl">{service.title}</h1>
                    <p className="mb-8 text-xl text-muted-foreground">{service.summary}</p>
                    <div className="flex flex-col justify-center gap-3 sm:flex-row">
                        <QuoteDialog
                            defaultService={service.slug}
                            defaultSource={`service:${service.slug}`}
                            trigger={<Button className="btn-primary">Get a free quote</Button>}
                        />
                        {isPricedServiceSlug(service.slug) ? (
                            <Button asChild variant="outline">
                                <Link href={`/residential?service=${service.slug}`}>Estimate this service</Link>
                            </Button>
                        ) : null}
                        <Button asChild variant="outline">
                            <Link href="/services">All services</Link>
                        </Button>
                    </div>
                </div>
            </header>

            <section className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 py-20 lg:grid-cols-2">
                <article>
                    <h2 className="font-display mb-6 text-2xl">How we handle it</h2>
                    <ul className="space-y-4 text-muted-foreground">
                        {service.details.map((detail) => (
                            <li key={detail} className="rounded-2xl border border-[oklch(0.86_0.015_95)] bg-[oklch(0.99_0.008_95)] p-4">
                                {detail}
                            </li>
                        ))}
                    </ul>
                    {isPricedServiceSlug(service.slug) ? (
                        <p className="mt-6 text-sm text-muted-foreground">
                            Homes are priced by BHK, businesses by square feet.{" "}
                            <Link href={`/residential?service=${service.slug}`} className="text-primary underline-offset-4 hover:underline">
                                Residential estimate
                            </Link>
                            {" · "}
                            <Link href={`/commercial?service=${service.slug}`} className="text-primary underline-offset-4 hover:underline">
                                Commercial estimate
                            </Link>
                        </p>
                    ) : null}
                </article>

                <div className="rounded-2xl border border-[oklch(0.86_0.015_95)] bg-[oklch(0.99_0.008_95)] p-8">
                    <h2 className="font-display mb-2 text-2xl">Request this service</h2>
                    <p className="mb-6 text-muted-foreground">
                        Share a few details and we will confirm a visit time.
                    </p>
                    <QuoteForm
                        defaultService={service.slug}
                        defaultSource={`service:${service.slug}`}
                        submitLabel="Request this service"
                    />
                </div>
            </section>
        </main>
    );
}
