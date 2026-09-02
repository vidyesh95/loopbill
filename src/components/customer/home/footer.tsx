"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { QuoteDialog } from "@/components/customer/quote-dialog";
import { usePublicCompany, usePublishedServices, usePublicSite } from "@/components/customer/public-site-context";
import { whatsappUrl } from "@/lib/data/services";

export default function Footer() {
  const company = usePublicCompany();
  const services = usePublishedServices();
  const { accountHref } = usePublicSite();
  const pest = services.filter((item) => item.category === "pest");
  const other = services.filter((item) => item.category === "other");
  return (
    <footer className="bg-[oklch(0.3_0.04_145)] text-[oklch(0.93_0.015_95)]">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <h3 className="font-display text-2xl">
              {company.name.replace("Private Limited", "").trim() || "Urban Pest Master"}
            </h3>
            <p className="mt-3 text-sm text-[oklch(0.84_0.02_95)]">
              Pest control from Mumbai to Palghar, by train or bus, with WhatsApp booking and
              published residential and commercial rates.
            </p>
          </div>

          <nav aria-label="Company">
            <h4 className="mb-4 text-sm font-semibold tracking-[0.14em] uppercase">Company</h4>
            <ul className="space-y-2 text-sm text-[oklch(0.84_0.02_95)]">
              <li>
                <Link href="/#about" className="hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/residential" className="hover:text-white">
                  Residential
                </Link>
              </li>
              <li>
                <Link href="/commercial" className="hover:text-white">
                  Commercial
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/complaint" className="hover:text-white">
                  Raise a complaint
                </Link>
              </li>
              <li>
                <Link href="/reschedule" className="hover:text-white">
                  Request reschedule
                </Link>
              </li>
              <li>
                <Link href={accountHref === "/account" ? "/account" : "/signin"} className="hover:text-white">
                  {accountHref === "/account" ? "My account" : "Sign in"}
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Services">
            <h4 className="mb-4 text-sm font-semibold tracking-[0.14em] uppercase">Services</h4>
            <ul className="space-y-2 text-sm text-[oklch(0.84_0.02_95)]">
              <li>
                <Link href="/services" className="hover:text-white">
                  All services
                </Link>
              </li>
              {pest.map((service) => (
                <li key={service.slug}>
                  <Link href={`/services/${service.slug}`} className="hover:text-white">
                    {service.title}
                  </Link>
                </li>
              ))}
              {other.map((service) => (
                <li key={service.slug}>
                  <Link href={`/services/${service.slug}`} className="hover:text-white">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-[0.14em] uppercase">Get a quote</h4>
            <ul className="mb-4 space-y-2 text-sm text-[oklch(0.84_0.02_95)]">
              <li>
                <QuoteDialog
                  defaultPropertyType="Residential"
                  defaultSource="footer-residential"
                  trigger={
                    <button type="button" className="hover:text-white">
                      Residential
                    </button>
                  }
                />
              </li>
              <li>
                <QuoteDialog
                  defaultPropertyType="Commercial"
                  defaultSource="footer-commercial"
                  trigger={
                    <button type="button" className="hover:text-white">
                      Commercial
                    </button>
                  }
                />
              </li>
              <li>
                <QuoteDialog
                  defaultSource="footer-emergency"
                  defaultMessage="I need emergency pest control."
                  title="Emergency service"
                  trigger={
                    <button type="button" className="hover:text-white">
                      Emergency
                    </button>
                  }
                />
              </li>
            </ul>
            <address className="text-sm text-[oklch(0.84_0.02_95)] not-italic">
              <ul className="space-y-2">
                <li>
                  <a href={`mailto:${company.email}`}>{company.email}</a>
                </li>
                {company.phones.map((phone) => (
                  <li key={phone.href}>
                    <a href={phone.href}>{phone.display}</a>
                  </li>
                ))}
                <li>
                  <Button asChild variant="secondary" size="sm">
                    <a href={whatsappUrl(undefined, company.whatsappNumber)} target="_blank" rel="noreferrer">
                      WhatsApp us
                    </a>
                  </Button>
                </li>
              </ul>
            </address>
          </div>
        </div>

        <p className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-[oklch(0.78_0.02_95)]">
          © {new Date().getFullYear()} Urban Pest Master Private Limited. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
