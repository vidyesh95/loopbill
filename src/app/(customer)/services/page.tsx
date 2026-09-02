import type {Metadata} from "next";
import Link from "next/link";
import {OTHER_SERVICES, PEST_SERVICES} from "@/lib/data/services";
import {QuoteDialog} from "@/components/customer/quote-dialog";
import {Button} from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Services | Urban Pest Master",
    description: "Residential and commercial pest control, plus invisible grill, bird proofing, and rat guards.",
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
    return (
        <li className="flex flex-col rounded-lg border border-gray-100 bg-white p-6">
            <h3 className="mb-2 text-xl font-semibold">
                <Link href={`/services/${slug}`} className="hover:text-primary">
                    {title}
                </Link>
            </h3>
            <p className="mb-6 flex-1 text-gray-600">{summary}</p>
            <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline">
                    <Link href={`/services/${slug}`}>Learn more</Link>
                </Button>
                <QuoteDialog
                    defaultService={slug}
                    defaultSource={`service:${slug}`}
                    trigger={<Button className="btn-primary">Get a quote</Button>}
                />
            </div>
        </li>
    );
}

export default function ServicesPage() {
    return (
        <main>
            <header className="bg-[#edebe4] py-20 text-center">
                <div className="mx-auto max-w-3xl px-4">
                    <h1 className="heading-gradient mb-6 text-4xl font-bold">Our Services</h1>
                    <p className="text-xl text-gray-600">
                        Pest-free living starts here. Choose a treatment or a proofing service and request a free quote.
                    </p>
                </div>
            </header>

            <section className="mx-auto max-w-7xl px-4 py-16">
                <h2 className="mb-8 text-2xl font-bold">Pest control</h2>
                <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {PEST_SERVICES.map((service) => (
                        <ServiceCard key={service.slug} {...service} />
                    ))}
                </ul>
            </section>

            <section className="mx-auto max-w-7xl px-4 pb-20">
                <h2 className="mb-8 text-2xl font-bold">Other services</h2>
                <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {OTHER_SERVICES.map((service) => (
                        <ServiceCard key={service.slug} {...service} />
                    ))}
                </ul>
            </section>
        </main>
    );
}
