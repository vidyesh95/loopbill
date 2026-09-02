import type { PropertyType } from "@/lib/data/services";

export const PRICED_SERVICE_SLUGS = [
  "cockroach",
  "termite",
  "bedbug",
  "wood-borer",
  "rodent",
  "mosquito",
] as const;

export type PricedServiceSlug = (typeof PRICED_SERVICE_SLUGS)[number];

export type DurationValue = "one-time" | "1-year" | "2-year";
export type BhkValue = "1bhk" | "2bhk" | "3bhk" | "4bhk" | "5bhk";

export const PRICED_SERVICES = [
  { slug: "cockroach", label: "Cockroach & Ant", residentialBase: 100, commercialPerSqft: 10 },
  { slug: "termite", label: "Termite", residentialBase: 150, commercialPerSqft: 15 },
  { slug: "bedbug", label: "Bedbug", residentialBase: 120, commercialPerSqft: 12 },
  { slug: "wood-borer", label: "Wood Borer", residentialBase: 200, commercialPerSqft: 20 },
  { slug: "rodent", label: "Rodent", residentialBase: 180, commercialPerSqft: 18 },
  { slug: "mosquito", label: "Mosquito", residentialBase: 190, commercialPerSqft: 19 },
] as const satisfies ReadonlyArray<{
  slug: PricedServiceSlug;
  label: string;
  residentialBase: number;
  commercialPerSqft: number;
}>;

export const BHK_OPTIONS = [
  { value: "1bhk", label: "1 BHK", multiplier: 1 },
  { value: "2bhk", label: "2 BHK", multiplier: 1.5 },
  { value: "3bhk", label: "3 BHK", multiplier: 2 },
  { value: "4bhk", label: "4 BHK", multiplier: 2.5 },
  { value: "5bhk", label: "5 BHK", multiplier: 3 },
] as const satisfies ReadonlyArray<{ value: BhkValue; label: string; multiplier: number }>;

export const SQFT_OPTIONS = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000] as const;

export const DURATION_OPTIONS = [
  { value: "one-time", label: "One Time", multiplier: 1 },
  { value: "1-year", label: "1 Year", multiplier: 1.1 },
  { value: "2-year", label: "2 Year", multiplier: 1.2 },
] as const satisfies ReadonlyArray<{ value: DurationValue; label: string; multiplier: number }>;

export function isPricedServiceSlug(value: string): value is PricedServiceSlug {
  return PRICED_SERVICES.some((service) => service.slug === value);
}

export type PricedServiceRate = {
  slug: string;
  label: string;
  residentialBase: number;
  commercialPerSqft: number;
};

export function getPricedService(slug: string, rates: readonly PricedServiceRate[] = PRICED_SERVICES) {
  return rates.find((service) => service.slug === slug);
}

export function calculatePrice(input: {
  propertyType: PropertyType;
  service: string;
  area: BhkValue | number;
  duration: DurationValue;
  rates?: readonly PricedServiceRate[];
}): number {
  const service = getPricedService(input.service, input.rates);
  const duration = DURATION_OPTIONS.find((option) => option.value === input.duration);
  if (!service || !duration) {
    return 0;
  }

  let amount = 0;
  if (input.propertyType === "Residential") {
    const bhk = BHK_OPTIONS.find((option) => option.value === input.area);
    if (!bhk) {
      return 0;
    }
    amount = service.residentialBase * bhk.multiplier * duration.multiplier;
  } else {
    const sqft =
      typeof input.area === "number" ? input.area : Number.parseInt(String(input.area), 10);
    if (!Number.isFinite(sqft)) {
      return 0;
    }
    amount = service.commercialPerSqft * sqft * duration.multiplier;
  }

  return Number(amount.toFixed(2));
}

export function formatInr(amount: number) {
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function describeQuote(input: {
  propertyType: PropertyType;
  service: string;
  area: BhkValue | number;
  duration: DurationValue;
  pincode?: string;
  price: number;
  rates?: readonly PricedServiceRate[];
}) {
  const service = getPricedService(input.service, input.rates);
  const duration = DURATION_OPTIONS.find((option) => option.value === input.duration);
  const areaLabel =
    input.propertyType === "Residential"
      ? BHK_OPTIONS.find((option) => option.value === input.area)?.label
      : `${input.area} sqft`;

  const lines = [
    `Interested in ${service?.label ?? input.service} (${input.propertyType}).`,
    `Area: ${areaLabel ?? input.area}. Duration: ${duration?.label ?? input.duration}.`,
    `Estimated price: ${formatInr(input.price)}.`,
  ];
  if (input.pincode?.trim()) {
    lines.push(`Pincode: ${input.pincode.trim()}.`);
  }
  return lines.join(" ");
}
