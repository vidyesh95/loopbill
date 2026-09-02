import {EnquiryForm} from "@/components/customer/enquiry-form";
import {BRANCHES, COMPANY_STATS} from "@/lib/data/services";

export function Locations() {
    return (
        <section className="bg-[oklch(0.94_0.016_95)] py-20">
            <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-2 lg:items-start">
                <div>
                    <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                        We are located at
                    </p>
                    <h2 className="font-display mt-3 text-3xl md:text-4xl">
                        Kandivali and Virar, serving Mumbai homes and AMCs
                    </h2>
                    <ul className="mt-8 grid gap-4 sm:grid-cols-3">
                        {COMPANY_STATS.map((stat) => (
                            <li
                                key={stat.label}
                                className="rounded-2xl border border-[oklch(0.78_0.02_95)] bg-[oklch(0.99_0.008_95)] p-5"
                            >
                                <p className="font-display text-3xl text-primary">{stat.value}</p>
                                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                            </li>
                        ))}
                    </ul>
                    <ul className="mt-8 space-y-4">
                        {BRANCHES.map((branch) => (
                            <li key={branch.name}>
                                <p className="font-semibold">{branch.name} branch</p>
                                <p className="text-muted-foreground">{branch.address}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="rounded-2xl border border-[oklch(0.78_0.02_95)] bg-[oklch(0.99_0.008_95)] p-6 sm:p-8">
                    <h3 className="font-display text-2xl">Tell us what you need</h3>
                    <p className="mt-2 mb-6 text-sm text-muted-foreground">
                        Name, phone, email, and a service. We will call or WhatsApp you back.
                    </p>
                    <EnquiryForm />
                </div>
            </div>
        </section>
    );
}
