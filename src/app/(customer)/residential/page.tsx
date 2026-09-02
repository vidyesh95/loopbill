import type { Metadata } from "next";
import { PropertySegment } from "@/components/customer/property-segment";
import { isPricedServiceSlug } from "@/lib/data/pricing";

export const metadata: Metadata = {
  title: "Residential Pest Control | Urban Pest Master",
  description:
    "Home pest control in Mumbai priced by BHK and duration — cockroach, bedbug, termite, rodent, mosquito, and wood borer.",
};

type PageProps = {
  searchParams: Promise<{ service?: string }>;
};

export default async function ResidentialPage({ searchParams }: PageProps) {
  const { service } = await searchParams;
  const defaultService = service && isPricedServiceSlug(service) ? service : undefined;

  return (
    <PropertySegment
      propertyType="Residential"
      eyebrow="Residential"
      title="Pest-free homes, priced by BHK"
      lede="1 to 5 BHK apartments and houses. Choose the pest, the size, and One Time, 1 Year, or 2 Year — then book the visit."
      defaultService={defaultService}
    />
  );
}
