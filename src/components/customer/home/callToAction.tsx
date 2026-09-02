import Link from "next/link";
import {Button} from "@/components/ui/button";
import {QuoteDialog} from "@/components/customer/quote-dialog";

export default function CallToAction() {
    return (
        <section className="relative overflow-hidden bg-primary py-20">
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)",
                    backgroundSize: "24px 24px",
                }}
            />

            <div className="relative z-10 mx-auto max-w-3xl px-4 text-center text-primary-foreground">
                <h2 className="font-display mb-4 text-3xl md:text-4xl">
                    Homes by BHK. Businesses by sqft.
                </h2>
                <p className="mb-8 text-lg opacity-90">
                    Estimate the treatment, then book on WhatsApp or leave a quote.
                </p>

                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                    <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                        <Link href="/residential">Residential</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10">
                        <Link href="/commercial">Commercial</Link>
                    </Button>
                    <QuoteDialog
                        defaultSource="mid-cta"
                        trigger={
                            <Button size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10">
                                Request a quote
                            </Button>
                        }
                    />
                </div>
            </div>
        </section>
    );
}
