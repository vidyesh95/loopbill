import Pricing from "@/components/customer/home/pricing";
import About from "@/components/customer/home/about";
import Contact from "@/components/customer/home/contact";
import Features from "@/components/customer/home/features";
import Hero from "@/components/customer/home/hero";
import CallToAction from "@/components/customer/home/callToAction";
import { Locations } from "@/components/customer/home/locations";
import { Crew } from "@/components/customer/home/crew";
import { ServiceCatalog } from "@/components/customer/home/service-catalog";
import { getPublicCompany } from "@/lib/public-site";

export default async function Home() {
  const company = await getPublicCompany();

  return (
    <div className="flex flex-col justify-center">
      <Hero />
      <main>
        <Features />
        <Crew />
        <ServiceCatalog />
        <CallToAction />
        <Pricing />
        <Locations />
        <About title={company.about.title} body={company.about.body} />
        <Contact
          email={company.email}
          phones={company.phones}
          branches={company.branches}
          hours={company.hours}
        />
      </main>
    </div>
  );
}
