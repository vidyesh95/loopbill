import { Button } from "@/components/ui/button";
import Pricing from "@/components/customer/home/pricing";
import About from "@/components/customer/home/about";
import Contact from "@/components/customer/home/contact";
import Link from "next/link";
import Features from "@/components/customer/home/features";

export default function Home() {
  return (
    <div className="flex flex-col justify-center">
      {/* Hero Section */}
      <header className="relative min-h-screen bg-gradient-to-b from-[#edebe4] to-[#f7f6f0] flex items-center">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl text-primary md:text-6xl font-bold mb-6 heading-gradient">
              Professional Pest Control Solutions
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Protect your home and business from unwanted pests with our expert
              services. Professional, reliable, and guaranteed results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-primary">Get Free Quote</Button>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Features Section */}
        <Features />

        {/* CTA Section */}
        <section className="relative bg-primary py-20 overflow-hidden">
          <div className="absolute inset-0">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                backgroundSize: "24px 24px",
              }}
            />
          </div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-lg mb-8 opacity-90">
                Contact us today for a free inspection and quote. Protect your
                property from pests!
              </p>
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100"
              >
                Contact Us Now
              </Button>
            </div>
          </div>
        </section>

        {/* about section */}
        <About />

        {/* pricing section */}
        <Pricing />

        {/* contact section */}
        <Contact />
      </main>

      <footer className="bg-[#edebe4]">
        <div className="max-w-7xl mx-auto py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Loopbill</h3>
              <p className="text-gray-600">
                Professional pest control services for your peace of mind.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={{ pathname: "/", hash: "about" }}
                    scroll={true}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href={{ pathname: "/", hash: "pricing" }}
                    scroll={true}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href={{ pathname: "/", hash: "contact" }}
                    scroll={true}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Services</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Residential
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Commercial
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Emergency
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="text-gray-600">1234 Pest Control St</li>
                <li className="text-gray-600">City, State 12345</li>
                <li className="text-gray-600">contact@loopbill.com</li>
                <li className="text-gray-600">(555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>
              &copy; {new Date().getFullYear()} Loopbill. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
