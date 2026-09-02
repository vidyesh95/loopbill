export default function About({
  title = "Urban Pest Master Private Limited",
  body = "Pest control for homes, societies, and commercial kitchens from Mumbai to Palghar, by train or bus. Office in Kandivali.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section id="about">
      <header className="bg-[oklch(0.99_0.008_95)] py-20 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">About us</p>
          <h2 className="mt-3 font-display text-4xl text-foreground">{title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{body}</p>
        </div>
      </header>

      <article className="bg-[oklch(0.94_0.016_95)] py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h3 className="mb-6 font-display text-3xl">The work</h3>
          <p className="mb-6 text-muted-foreground">
            We inspect first, treat for the pest that is actually there, and leave the site usable.
            Residential jobs are priced by BHK. Commercial jobs are priced by square feet. Both can
            be one visit or a 1- or 2-year AMC.
          </p>
          <p className="text-muted-foreground">
            Alongside the six pest treatments we install invisible grills, bird proofing, and rat
            guards — quoted after we see the openings, roosts, or risers.
          </p>
        </div>
      </article>

      <section className="bg-[oklch(0.99_0.008_95)] py-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h3 className="mb-12 font-display text-3xl">How we run a visit</h3>
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                title: "Inspect",
                description:
                  "We come to you, walk the site, and take your constraints into account.",
              },
              {
                title: "Treat",
                description: "A few hours on site, depending on house size and the amount of work.",
              },
              {
                title: "Clear",
                description:
                  "We handle the removal after disinfection so you are not left with it.",
              },
            ].map(({ title, description }) => (
              <li
                key={title}
                className="rounded-2xl border border-[oklch(0.86_0.015_95)] bg-[oklch(0.965_0.012_95)] p-6"
              >
                <h4 className="mb-3 text-xl font-semibold">{title}</h4>
                <p className="text-muted-foreground">{description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </section>
  );
}
