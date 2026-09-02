import type {Metadata} from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Terms & Conditions | Urban Pest Master",
    description: "Terms for Urban Pest Master pest control and related services.",
};

export default function TermsPage() {
    return (
        <main className="mx-auto max-w-3xl px-4 py-20">
            <h1 className="heading-gradient mb-6 text-4xl font-bold">Terms & Conditions</h1>
            <div className="space-y-4 text-gray-600">
                <p>
                    Urban Pest Master Private Limited provides pest control and related services in Mumbai
                    and surrounding areas. By requesting a quote or booking a visit, you agree to these terms.
                </p>
                <p>
                    Quotes are estimates until a technician inspects the site. Treatment plans, prices, and
                    visit counts can change after inspection. Scheduled visits may be rescheduled if someone
                    must be present at the property.
                </p>
                <p>
                    You are responsible for following pre- and post-treatment instructions. We are not liable
                    for infestation that returns because those steps were skipped, or for damage caused by
                    hidden structural issues.
                </p>
                <p>
                    Personal details you send on this website are used to contact you about the enquiry.
                    We do not sell that information.
                </p>
                <p>
                    Questions:{" "}
                    <a className="text-primary underline" href="mailto:contact@urbanpestmaster.in">
                        contact@urbanpestmaster.in
                    </a>
                    {" "}or see our{" "}
                    <Link className="text-primary underline" href="/#contact">
                        contact page
                    </Link>
                    .
                </p>
            </div>
        </main>
    );
}
