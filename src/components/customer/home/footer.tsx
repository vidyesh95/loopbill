import Link from "next/link";
import {Button} from "@/components/ui/button";
import {QuoteDialog} from "@/components/customer/quote-dialog";
import {
    COMPANY_EMAIL,
    COMPANY_PHONES,
    OTHER_SERVICES,
    PEST_SERVICES,
    WHATSAPP_URL,
} from "@/lib/data/services";

export default function Footer() {
    return (
        <footer className="bg-[#edebe4] py-12">
            <div className="mx-auto max-w-7xl px-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div>
                        <h3 className="mb-4 text-2xl font-semibold text-primary">UrbanPestMaster</h3>
                        <p className="text-gray-600">
                            Professional pest control services for your peace of mind.
                        </p>
                    </div>

                    <nav aria-label="Company">
                        <h4 className="mb-4 text-lg font-semibold">Company</h4>
                        <ul className="space-y-2">
                            <li><Link href="/#about" className="text-gray-600 hover:text-gray-900">About</Link></li>
                            <li><Link href="/#pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link></li>
                            <li><Link href="/#contact" className="text-gray-600 hover:text-gray-900">Contact</Link></li>
                            <li><Link href="/terms" className="text-gray-600 hover:text-gray-900">Terms & Conditions</Link></li>
                        </ul>
                    </nav>

                    <nav aria-label="Services">
                        <h4 className="mb-4 text-lg font-semibold">Services</h4>
                        <ul className="space-y-2">
                            <li><Link href="/services" className="text-gray-600 hover:text-gray-900">All services</Link></li>
                            {PEST_SERVICES.map((service) => (
                                <li key={service.slug}>
                                    <Link href={`/services/${service.slug}`} className="text-gray-600 hover:text-gray-900">
                                        {service.title}
                                    </Link>
                                </li>
                            ))}
                            {OTHER_SERVICES.map((service) => (
                                <li key={service.slug}>
                                    <Link href={`/services/${service.slug}`} className="text-gray-600 hover:text-gray-900">
                                        {service.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div>
                        <h4 className="mb-4 text-lg font-semibold">Get a quote</h4>
                        <ul className="mb-4 space-y-2">
                            <li>
                                <QuoteDialog
                                    defaultPropertyType="Residential"
                                    defaultSource="footer-residential"
                                    trigger={
                                        <button type="button" className="text-gray-600 hover:text-gray-900">
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
                                        <button type="button" className="text-gray-600 hover:text-gray-900">
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
                                        <button type="button" className="text-gray-600 hover:text-gray-900">
                                            Emergency
                                        </button>
                                    }
                                />
                            </li>
                        </ul>
                        <address className="not-italic text-gray-600">
                            <ul className="space-y-2">
                                <li>
                                    <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>
                                </li>
                                {COMPANY_PHONES.map((phone) => (
                                    <li key={phone.href}>
                                        <a href={phone.href}>{phone.display}</a>
                                    </li>
                                ))}
                                <li>
                                    <Button asChild variant="outline" size="sm">
                                        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                                            WhatsApp us
                                        </a>
                                    </Button>
                                </li>
                            </ul>
                        </address>
                    </div>
                </div>

                <p className="mt-8 border-t border-gray-200 pt-8 text-center text-gray-600">
                    &copy; {new Date().getFullYear()} UrbanPestMaster. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
