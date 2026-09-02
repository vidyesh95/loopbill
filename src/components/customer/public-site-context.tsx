"use client";

import { createContext, useContext, type ReactNode } from "react";
import { SERVICES, type ServiceOffering } from "@/lib/data/services";
import { PRICED_SERVICES, type PricedServiceRate } from "@/lib/data/pricing";
import { DEFAULT_CREW, DEFAULT_FAQ, DEFAULT_FEATURES } from "@/lib/data/site-defaults";
import type { PublicCompany } from "@/lib/public-site";

export type PublicSiteValue = {
  company: PublicCompany;
  services: ServiceOffering[];
  pricing: PricedServiceRate[];
  accountHref?: string;
};

const fallbackCompany: PublicCompany = {
  name: "UrbanPestMaster",
  address: "",
  email: "contact@urbanpestmaster.in",
  phone: "+91 74985 18198",
  phones: [
    { display: "+91 74985 18198", href: "tel:+917498518198" },
    { display: "+91 86001 39094", href: "tel:+918600139094" },
  ],
  whatsappNumber: "918600139094",
  branches: [],
  stats: [],
  stations: [],
  hours: "Mon–Sat 9:00 AM – 7:00 PM",
  hero: {
    eyebrow: "Mumbai to Palghar · by train or bus",
    title: "Pest-free homes and businesses, on your terms.",
    body: "Residential rates by BHK. Commercial rates by square feet.",
  },
  about: {
    title: "Urban Pest Master Private Limited",
    body: "Pest control for homes, societies, and commercial kitchens from Mumbai to Palghar.",
  },
  faq: [...DEFAULT_FAQ],
  features: DEFAULT_FEATURES,
  crew: DEFAULT_CREW,
  terms: "",
};

const PublicSiteContext = createContext<PublicSiteValue>({
  company: fallbackCompany,
  services: SERVICES,
  pricing: [...PRICED_SERVICES],
});

export function PublicSiteProvider({
  value,
  children,
}: {
  value: PublicSiteValue;
  children: ReactNode;
}) {
  return <PublicSiteContext.Provider value={value}>{children}</PublicSiteContext.Provider>;
}

export function usePublicSite() {
  return useContext(PublicSiteContext);
}

export function usePublishedServices() {
  return usePublicSite().services;
}

export function usePublicPricing() {
  const { pricing } = usePublicSite();
  return pricing.length > 0 ? pricing : [...PRICED_SERVICES];
}

export function usePublicCompany() {
  return usePublicSite().company;
}
