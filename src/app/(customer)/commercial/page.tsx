import type {Metadata} from "next";
import {PropertySegment} from "@/components/customer/property-segment";
import {isPricedServiceSlug} from "@/lib/data/pricing";

export const metadata: Metadata = {
    title: "Commercial Pest Control | Urban Pest Master",
    description:
        "Commercial pest control in Mumbai priced by square feet — offices, shops, warehouses, restaurants, and healthcare facilities.",
};

type PageProps = {
    searchParams: Promise<{service?: string}>;
};

export default async function CommercialPage({searchParams}: PageProps) {
    const {service} = await searchParams;
    const defaultService = service && isPricedServiceSlug(service) ? service : undefined;

    return (
        <PropertySegment
            propertyType="Commercial"
            eyebrow="Commercial"
            title="Offices and kitchens, priced by sqft"
            lede="Offices, retail, warehouses, restaurants, and clinics. Rates follow square feet and One Time, 1 Year, or 2 Year AMC."
            defaultService={defaultService}
        />
    );
}
