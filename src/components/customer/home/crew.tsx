import Image from "next/image";
import { QuoteDialog } from "@/components/customer/quote-dialog";

export function Crew() {
  return (
    <section className="bg-[oklch(0.96_0.01_95)] px-4 py-24 md:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium tracking-[0.22em] text-primary uppercase">On site</p>
        <h2 className="mt-4 font-display text-4xl tracking-tight text-foreground md:text-5xl">
          The crew that walks the site
        </h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Inspect, treat, and leave the rooms usable. No extra equipment in the hallway.
        </p>
        <QuoteDialog
          defaultSource="crew"
          trigger={
            <button
              type="button"
              className="mt-6 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Get a quote
            </button>
          }
        />
      </div>

      <div className="relative mx-auto mt-12 flex w-full max-w-xl justify-center md:mt-16 md:max-w-2xl">
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 size-[min(38rem,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.88_0.03_145/0.35)_0%,transparent_68%)]"
        />
        <Image
          src="/sprayman.svg"
          alt="Urban Pest Master technician"
          width={560}
          height={560}
          className="relative h-auto w-[min(560px,86vw)]"
        />
      </div>
    </section>
  );
}
