import {Button} from "@/components/ui/button";
import {QuoteDialog} from "@/components/customer/quote-dialog";

export default function CallToAction() {
    return (
        <section className="relative overflow-hidden bg-primary py-20">
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
                    backgroundSize: "24px 24px",
                }}
            />

            <div className="relative z-10 mx-auto max-w-3xl px-4 text-center text-white">
                <h2 className="mb-6 text-3xl font-bold">Ready to Get Started?</h2>
                <p className="mb-8 text-lg opacity-90">
                    Contact us today for a free inspection and quote. Protect your
                    property from pests!
                </p>

                <QuoteDialog
                    defaultSource="mid-cta"
                    trigger={
                        <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                            Contact Us Now
                        </Button>
                    }
                />
            </div>
        </section>
    );
}
