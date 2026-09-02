import { QuoteForm } from "@/components/customer/quote-form";
import { BRANCHES, COMPANY_EMAIL, COMPANY_PHONES, whatsappUrl } from "@/lib/data/services";

const Contact = ({
  email = COMPANY_EMAIL,
  phones = COMPANY_PHONES,
  branches = BRANCHES,
  hours = "Monday – Saturday: 9 am – 7 pm",
}: {
  email?: string;
  phones?: ReadonlyArray<{ display: string; href: string }>;
  branches?: ReadonlyArray<{ name: string; address: string }>;
  hours?: string;
}) => {
  return (
    <section id="contact" className="flex flex-col bg-[oklch(0.965_0.012_95)]">
      <header className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Contact</p>
        <h2 className="mt-3 font-display text-4xl">Call, WhatsApp, or send a quote</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          The same number answers homes and commercial sites.
        </p>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 pb-20 lg:grid-cols-2">
        <article className="space-y-6">
          <h3 className="text-2xl font-semibold">Branches</h3>
          <ul className="space-y-4 text-muted-foreground">
            {branches.map((branch) => (
              <li key={branch.name}>
                <strong className="text-foreground">{branch.name} branch</strong>
                <br />
                {branch.address}
              </li>
            ))}
            <li>
              <a href={`mailto:${email}`}>{email}</a>
            </li>
            {phones.map((phone) => (
              <li key={phone.href}>
                <a href={phone.href}>{phone.display}</a>
              </li>
            ))}
            <li>
              <a href={whatsappUrl()} target="_blank" rel="noreferrer">
                WhatsApp +91 86001 39094
              </a>
            </li>
          </ul>

          <div>
            <h4 className="mb-2 font-semibold">Office hours</h4>
            <p className="text-muted-foreground">{hours}</p>
            <p className="text-muted-foreground">Saturday: 9 am – 2 pm</p>
            <p className="text-muted-foreground">Sunday: Closed</p>
          </div>

          <div>
            <h4 className="mb-2 font-semibold">Emergency service</h4>
            <p className="text-muted-foreground">
              After-hours jobs go through the same WhatsApp number.
            </p>
          </div>
        </article>

        <div className="space-y-6 rounded-2xl border border-[oklch(0.86_0.015_95)] bg-[oklch(0.99_0.008_95)] p-8">
          <QuoteForm defaultSource="contact" />
        </div>
      </div>
    </section>
  );
};

export default Contact;
