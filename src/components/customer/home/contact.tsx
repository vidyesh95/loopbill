import {QuoteForm} from "@/components/customer/quote-form";
import {COMPANY_EMAIL, COMPANY_PHONES, WHATSAPP_URL} from "@/lib/data/services";

const Contact = () => {
    return (
        <section id="contact" className="flex flex-col bg-[#f7f6f0]">
            <header className="mx-auto max-w-3xl py-20 text-center">
                <h1 className="heading-gradient mb-6 text-4xl font-bold">
                    Get in Touch
                </h1>
                <p className="text-xl text-gray-600">
                    We&apos;re here to help with all your pest control needs
                </p>
            </header>

            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 pb-20 lg:grid-cols-2">
                <article className="space-y-6">
                    <h2 className="text-2xl font-bold">Contact Information</h2>

                    <ul className="space-y-2 text-gray-600">
                        <li>
                            <strong>Kandivali Branch:<br /></strong>
                            Shop no. 1, Ram Bhagat Pandey Apartment,<br />
                            Poisar, Kandivali (E) - 400 101
                        </li>
                        <li>
                            <strong>Virar Branch:<br /></strong>
                            Shop no. 10, Yashwant Nagar,<br />
                            Virar (W) - 401 303
                        </li>
                        <li>
                            <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>
                        </li>
                        {COMPANY_PHONES.map((phone) => (
                            <li key={phone.href}>
                                <a href={phone.href}>{phone.display}</a>
                            </li>
                        ))}
                        <li>
                            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                                WhatsApp +91 86001 39094
                            </a>
                        </li>
                    </ul>

                    <div>
                        <h3 className="mb-2 font-semibold">Office Hours</h3>
                        <p className="text-gray-600">Monday – Friday: 8 am – 6 pm</p>
                        <p className="text-gray-600">Saturday: 9 am – 2 pm</p>
                        <p className="text-gray-600">Sunday: Closed</p>
                    </div>

                    <div>
                        <h3 className="mb-2 font-semibold">Emergency Service</h3>
                        <p className="text-gray-600">
                            24/7 emergency pest control services available
                        </p>
                    </div>
                </article>

                <div className="space-y-6 rounded-lg bg-white p-8">
                    <QuoteForm defaultSource="contact" />
                </div>
            </div>
        </section>
    );
};

export default Contact;
