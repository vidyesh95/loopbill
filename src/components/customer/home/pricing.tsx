import Link from "next/link";
import {PriceCalculator} from "@/components/customer/price-calculator";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

const frequentlyAskedQuestions = [
    {
        question: "How is the price calculated?",
        answer:
            "Homes are priced by pest type, BHK size, and duration. Commercial sites are priced by pest type, square feet, and the same One Time / 1 Year / 2 Year options.",
    },
    {
        question: "What is the difference between One Time and a 1 or 2 Year plan?",
        answer:
            "One Time is a single treatment. 1 Year and 2 Year are annual maintenance contracts at 1.1× and 1.2× the one-time rate, with return visits as the contract specifies.",
    },
    {
        question: "Do you re-treat if pests come back?",
        answer:
            "If pests return after a scheduled treatment, tell us in the same calendar month and we will arrange a re-service.",
    },
    {
        question: "Why is there no price for Invisible Grill, Bird Proofing, or Rat Guard?",
        answer:
            "Those jobs are measured on site. Send an enquiry and we will quote after we see the openings or roosts.",
    },
];

type PricingProps = {
    defaultPropertyType?: "Residential" | "Commercial";
    defaultService?: string;
};

const Pricing = ({defaultPropertyType = "Residential", defaultService}: PricingProps) => (
    <section id="pricing" className="bg-[oklch(0.965_0.012_95)]">
        <header className="px-4 pt-20 text-center">
            <div className="mx-auto max-w-3xl">
                <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                    Published rates
                </p>
                <h2 className="font-display mt-3 text-4xl text-foreground md:text-5xl">
                    Homes by BHK. Businesses by sqft.
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    Residential and commercial use different rate cards. Pick a track, estimate the
                    treatment, then book on WhatsApp or through the quote form.
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                    Need a dedicated page?{" "}
                    <Link href="/residential" className="text-primary underline-offset-4 hover:underline">
                        Residential
                    </Link>
                    {" · "}
                    <Link href="/commercial" className="text-primary underline-offset-4 hover:underline">
                        Commercial
                    </Link>
                </p>
            </div>
        </header>

        <div className="mx-auto max-w-3xl px-4 py-12">
            <Tabs defaultValue={defaultPropertyType} className="gap-6">
                <TabsList className="mx-auto grid h-auto w-full grid-cols-2 rounded-full bg-[oklch(0.92_0.016_95)] p-1">
                    <TabsTrigger
                        value="Residential"
                        className="rounded-full px-4 py-2 data-[state=active]:bg-[oklch(0.99_0.008_95)]"
                    >
                        Residential
                    </TabsTrigger>
                    <TabsTrigger
                        value="Commercial"
                        className="rounded-full px-4 py-2 data-[state=active]:bg-[oklch(0.99_0.008_95)]"
                    >
                        Commercial
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="Residential">
                    <PriceCalculator
                        propertyType="Residential"
                        defaultService={defaultService}
                        source="pricing:residential"
                    />
                </TabsContent>
                <TabsContent value="Commercial">
                    <PriceCalculator
                        propertyType="Commercial"
                        defaultService={defaultService}
                        source="pricing:commercial"
                    />
                </TabsContent>
            </Tabs>
        </div>

        <section className="border-t border-[oklch(0.86_0.015_95)] py-16">
            <div className="mx-auto max-w-3xl px-4">
                <h3 className="font-display mb-8 text-center text-3xl">Questions about AMC and visits</h3>
                <ul className="grid gap-4">
                    {frequentlyAskedQuestions.map(({question, answer}) => (
                        <li
                            key={question}
                            className="rounded-2xl border border-[oklch(0.86_0.015_95)] bg-[oklch(0.99_0.008_95)] p-6"
                        >
                            <h4 className="mb-2 text-lg font-semibold">{question}</h4>
                            <p className="text-muted-foreground">{answer}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    </section>
);

export default Pricing;
