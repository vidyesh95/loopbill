"use client";

import Link from "next/link";
import { usePublicCompany } from "@/components/customer/public-site-context";

export default function Features() {
  const { features } = usePublicCompany();
  const reasons = features.items;
  return (
    <section className="bg-[oklch(0.965_0.012_95)] py-20">
      <header className="mx-auto mb-12 max-w-2xl px-4 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          {features.eyebrow}
        </p>
        <h2 className="mt-3 font-display text-3xl md:text-4xl">{features.title}</h2>
      </header>

      <ul className="mx-auto grid max-w-6xl gap-4 px-4 md:grid-cols-3">
        {reasons.map(({ title, description }) => (
          <li
            key={title}
            className="rounded-2xl border border-[oklch(0.86_0.015_95)] bg-[oklch(0.99_0.008_95)] p-6"
          >
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="mt-3 text-muted-foreground">{description}</p>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-center text-sm text-muted-foreground">
        <Link href="/residential" className="text-primary underline-offset-4 hover:underline">
          Residential
        </Link>
        {" · "}
        <Link href="/commercial" className="text-primary underline-offset-4 hover:underline">
          Commercial
        </Link>
      </p>
    </section>
  );
}
