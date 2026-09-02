import type { Metadata } from "next";
import Link from "next/link";
import { getPublicCompany } from "@/lib/public-site";

export const metadata: Metadata = {
  title: "Terms & Conditions | Urban Pest Master",
  description: "Terms for Urban Pest Master pest control and related services.",
};

export default async function TermsPage() {
  const company = await getPublicCompany();
  const terms =
    company.terms ||
    "Urban Pest Master Private Limited provides pest control and related services in Mumbai and surrounding areas. By requesting a quote or booking a visit, you agree to these terms.";

  return (
    <main className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="heading-gradient mb-6 text-4xl font-bold">Terms & Conditions</h1>
      <div className="space-y-4 text-gray-600">
        {terms.split("\n").map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p>
          Questions:{" "}
          <a className="text-primary underline" href={`mailto:${company.email}`}>
            {company.email}
          </a>{" "}
          or see our{" "}
          <Link className="text-primary underline" href="/#contact">
            contact page
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
