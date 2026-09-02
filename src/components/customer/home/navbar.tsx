"use client";

import Link from "next/link";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { whatsappUrl } from "@/lib/data/services";
import { usePublicCompany, usePublishedServices, usePublicSite } from "@/components/customer/public-site-context";

const links = [
  { href: "/residential", label: "Residential" },
  { href: "/commercial", label: "Commercial" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const company = usePublicCompany();
  const services = usePublishedServices();
  const { accountHref } = usePublicSite();
  const pest = services.filter((item) => item.category === "pest");
  const other = services.filter((item) => item.category === "other");
  const primaryPhone = company.phones[1] ?? company.phones[0];
  return (
    <header className="sticky top-0 z-50">
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 text-xs sm:text-sm">
          <a href={primaryPhone.href} className="inline-flex items-center gap-2 hover:opacity-90">
            <Phone className="size-3.5" />
            {primaryPhone.display}
          </a>
          <div className="flex items-center gap-4">
            <Link href="/residential" className="hidden hover:opacity-90 sm:inline">
              Residential
            </Link>
            <Link href="/commercial" className="hidden hover:opacity-90 sm:inline">
              Commercial
            </Link>
            <a
              href={whatsappUrl(undefined, company.whatsappNumber)}
              target="_blank"
              rel="noreferrer"
              className="hover:opacity-90"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <nav className="border-b border-[oklch(0.86_0.015_95)] bg-[oklch(0.955_0.014_95)]/95 backdrop-blur">
        <div className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
          <Sheet>
            <SheetTrigger className="md:hidden" aria-label="Open menu">
              <Menu className="size-6" />
            </SheetTrigger>

            <SheetContent side="left" className="overflow-y-auto">
              <SheetHeader className="space-y-4">
                {links.map(({ href, label }) => (
                  <SheetTitle key={href}>
                    <SheetClose asChild>
                      <Link href={href} className="block">
                        {label}
                      </Link>
                    </SheetClose>
                  </SheetTitle>
                ))}
                <SheetTitle>
                  <SheetClose asChild>
                    <Link href="/services" className="block">
                      Services
                    </Link>
                  </SheetClose>
                </SheetTitle>
                <div className="space-y-2 text-left">
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Pest control
                  </p>
                  {pest.map((service) => (
                    <SheetClose asChild key={service.slug}>
                      <Link
                        href={`/services/${service.slug}`}
                        className="block text-sm text-muted-foreground"
                      >
                        {service.title}
                      </Link>
                    </SheetClose>
                  ))}
                  <p className="pt-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Other
                  </p>
                  {other.map((service) => (
                    <SheetClose asChild key={service.slug}>
                      <Link
                        href={`/services/${service.slug}`}
                        className="block text-sm text-muted-foreground"
                      >
                        {service.title}
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              </SheetHeader>
            </SheetContent>
          </Sheet>

          <Link href="/" className="font-display text-xl tracking-tight text-primary md:text-2xl">
            {company.name.replace("Private Limited", "").trim() || "Urban Pest Master"}
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm font-medium outline-none">
                Services
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/services">All services</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Pest control</DropdownMenuLabel>
                {pest.map((service) => (
                  <DropdownMenuItem key={service.slug} asChild>
                    <Link href={`/services/${service.slug}`}>{service.title}</Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Other services</DropdownMenuLabel>
                {other.map((service) => (
                  <DropdownMenuItem key={service.slug} asChild>
                    <Link href={`/services/${service.slug}`}>{service.title}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {links.map(({ href, label }) => (
              <Link key={href} href={href} className="text-sm font-medium hover:text-primary">
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            <Button asChild variant="ghost" size="sm">
              <Link href={accountHref === "/account" ? "/account" : "/signin"}>
                {accountHref === "/account" ? "Account" : "Sign in"}
              </Link>
            </Button>
            <Button asChild className="btn-primary">
              <a href={whatsappUrl("I want to book a pest control service.", company.whatsappNumber)}>
                Get a quote
              </a>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
