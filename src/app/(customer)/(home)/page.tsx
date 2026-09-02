import Pricing from "@/components/customer/home/pricing";
import About from "@/components/customer/home/about";
import Contact from "@/components/customer/home/contact";
import Features from "@/components/customer/home/features";
import Hero from "@/components/customer/home/hero";
import CallToAction from "@/components/customer/home/callToAction";
import {Locations} from "@/components/customer/home/locations";
import {ServiceCatalog} from "@/components/customer/home/service-catalog";

export default function Home() {
    return (
        <div className="flex flex-col justify-center">
            <Hero />
            <main>
                <Features />
                <ServiceCatalog />
                <CallToAction />
                <Pricing />
                <Locations />
                <About />
                <Contact />
            </main>
        </div>
    );
}
