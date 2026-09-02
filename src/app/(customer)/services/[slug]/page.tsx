import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {getServiceBySlug, SERVICES} from "@/lib/data/services";
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
            <header className="bg-[#edebe4] py-20">
                <div className="mx-auto max-w-3xl px-4 text-center">
                    <p className="mb-3 text-sm font-medium uppercase tracking-wide text-primary">
                        {service.category === "pest" ? "Pest control" : "Other services"}
                    </p>
                    <h1 className="heading-gradient mb-6 text-4xl font-bold">{service.title}</h1>
                    <p className="mb-8 text-xl text-gray-600">{service.summary}</p>
                    <div className="flex flex-col justify-center gap-3 sm:flex-row">
                        <QuoteDialog
                            defaultService={service.slug}
                            defaultSource={`service:${service.slug}`}
                            trigger={<Button className="btn-primary">Get a free quote</Button>}
                        />
                        <Button asChild variant="outline">
                            <Link href="/services">All services</Link>
                        </Button>
                    </div>
                </div>
            </header>

            <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-20 lg:grid-cols-2">
                <article>
                    <h2 className="mb-6 text-2xl font-bold">How we handle it</h2>
                    <ul className="space-y-4 text-gray-600">
                        {service.details.map((detail) => (
                            <li key={detail} className="rounded-lg bg-white p-4">
                                {detail}
                            </li>
                        ))}
                    </ul>
                </article>

                <div className="rounded-lg bg-white p-8">
                    <h2 className="mb-2 text-2xl font-bold">Request this service</h2>
                    <p className="mb-6 text-gray-600">
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
