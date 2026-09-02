import type {Metadata} from "next";
import {ServiceCatalog} from "@/components/customer/home/service-catalog";

export const metadata: Metadata = {
    title: "Services | Urban Pest Master",
    description: "Residential and commercial pest control, plus invisible grill, bird proofing, and rat guards.",
};

export default function ServicesPage() {
    return (
        <main>
            <ServiceCatalog />
        </main>
    );
}
