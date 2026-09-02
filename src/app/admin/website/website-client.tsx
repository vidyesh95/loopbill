"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { upsertSiteContent, upsertSitePricing, upsertSiteService } from "@/lib/actions/cms";
import { formString } from "@/lib/utils";

type ServiceRow = {
  id: number;
  slug: string;
  title: string;
  category: string;
  summary: string;
  details: string;
  sort: number;
  published: boolean;
};

type PricingRow = {
  id: number;
  slug: string;
  label: string;
  residentialBase: number;
  commercialPerSqft: number;
};

export default function WebsiteClient({
  services,
  pricing,
  content,
}: {
  services: ServiceRow[];
  pricing: PricingRow[];
  content: Array<{ key: string; value: string }>;
  company: {
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
  } | null;
  branches: Array<{ id: number; name: string; address: string }>;
}) {
  const router = useRouter();
  const contentMap = Object.fromEntries(content.map((row) => [row.key, row.value]));
  const hero = safeJson(contentMap.hero, { eyebrow: "", title: "", body: "" });
  const about = safeJson(contentMap.about, { title: "", body: "" });
  const features = safeJson(contentMap.features, {
    eyebrow: "",
    title: "",
    items: [
      { title: "", description: "" },
      { title: "", description: "" },
      { title: "", description: "" },
    ],
  });
  const crew = safeJson(contentMap.crew, { eyebrow: "", title: "", body: "" });
  const faq = safeJson(contentMap.faq, [{ question: "", answer: "" }]);
  const stats = safeJson(contentMap.stats, [{ value: "", label: "" }]);
  const stations = safeJson(contentMap.stations, [{ region: "", stations: [] as string[] }]);

  return (
    <main className="flex w-full flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Website</h1>
        <p className="text-muted-foreground">Edit public catalog, pricing, and page copy</p>
      </div>
      <Tabs defaultValue="services">
        <TabsList className="w-full">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="copy">Page copy</TabsTrigger>
        </TabsList>
        <TabsContent value="services" className="space-y-4">
          {services.map((item) => (
            <form
              key={item.id}
              className="grid gap-2 rounded-md border p-3"
              action={async (formData) => {
                const result = await upsertSiteService({
                  id: item.id,
                  slug: formString(formData, "slug", item.slug),
                  title: formString(formData, "title"),
                  category: formData.get("category") === "other" ? "other" : "pest",
                  summary: formString(formData, "summary"),
                  details: formString(formData, "details")
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean),
                  published: formData.get("published") === "on",
                  sort: item.sort,
                });
                if (!result.ok) {
                  toast.error(result.error);
                  return;
                }
                toast.success("Service saved");
                router.refresh();
              }}
            >
              <div className="grid gap-2 md:grid-cols-3">
                <Input name="slug" defaultValue={item.slug} />
                <Input name="title" defaultValue={item.title} />
                <select
                  name="category"
                  defaultValue={item.category}
                  className="h-10 rounded-md border px-3 text-sm"
                >
                  <option value="pest">pest</option>
                  <option value="other">other</option>
                </select>
              </div>
              <Textarea name="summary" defaultValue={item.summary} />
              <Textarea
                name="details"
                defaultValue={parseDetails(item.details).join("\n")}
                rows={4}
              />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="published" defaultChecked={item.published} />
                Published
              </label>
              <Button type="submit" size="sm">
                Save {item.slug}
              </Button>
            </form>
          ))}
        </TabsContent>
        <TabsContent value="pricing" className="space-y-4">
          {pricing.map((item) => (
            <form
              key={item.id}
              className="grid gap-2 rounded-md border p-3 md:grid-cols-4"
              action={async (formData) => {
                const result = await upsertSitePricing({
                  id: item.id,
                  slug: item.slug,
                  label: formString(formData, "label", item.label),
                  residentialBase: Number(formData.get("residentialBase") || 0),
                  commercialPerSqft: Number(formData.get("commercialPerSqft") || 0),
                });
                if (!result.ok) {
                  toast.error(result.error);
                  return;
                }
                toast.success("Pricing saved");
                router.refresh();
              }}
            >
              <Input name="label" defaultValue={item.label} />
              <Input name="residentialBase" type="number" defaultValue={item.residentialBase} />
              <Input name="commercialPerSqft" type="number" defaultValue={item.commercialPerSqft} />
              <Button type="submit">Save</Button>
            </form>
          ))}
        </TabsContent>
        <TabsContent value="copy" className="space-y-6">
          <form
            className="max-w-2xl space-y-2"
            action={async (formData) => {
              await upsertSiteContent("hero", {
                eyebrow: formString(formData, "eyebrow"),
                title: formString(formData, "title"),
                body: formString(formData, "body"),
              });
              toast.success("Hero saved");
              router.refresh();
            }}
          >
            <h2 className="font-semibold">Hero</h2>
            <Input name="eyebrow" defaultValue={hero.eyebrow} />
            <Input name="title" defaultValue={hero.title} />
            <Textarea name="body" defaultValue={hero.body} />
            <Button type="submit">Save hero</Button>
          </form>
          <form
            className="max-w-2xl space-y-2"
            action={async (formData) => {
              await upsertSiteContent("about", {
                title: formString(formData, "title"),
                body: formString(formData, "body"),
              });
              toast.success("About saved");
              router.refresh();
            }}
          >
            <h2 className="font-semibold">About</h2>
            <Input name="title" defaultValue={about.title} />
            <Textarea name="body" defaultValue={about.body} />
            <Button type="submit">Save about</Button>
          </form>
          <form
            className="max-w-2xl space-y-2"
            action={async (formData) => {
              await upsertSiteContent("terms", formString(formData, "terms"));
              toast.success("Terms saved");
              router.refresh();
            }}
          >
            <h2 className="font-semibold">Terms</h2>
            <Textarea name="terms" defaultValue={contentMap.terms ?? ""} rows={6} />
            <Button type="submit">Save terms</Button>
          </form>
          <form
            className="max-w-2xl space-y-2"
            action={async (formData) => {
              await upsertSiteContent("features", {
                eyebrow: formString(formData, "eyebrow"),
                title: formString(formData, "title"),
                items: [0, 1, 2].map((index) => ({
                  title: formString(formData, `itemTitle${index}`),
                  description: formString(formData, `itemBody${index}`),
                })),
              });
              toast.success("Features saved");
              router.refresh();
            }}
          >
            <h2 className="font-semibold">Features</h2>
            <Input name="eyebrow" defaultValue={features.eyebrow} />
            <Input name="title" defaultValue={features.title} />
            {[0, 1, 2].map((index) => {
              const item = features.items[index] ?? { title: "", description: "" };
              return (
                <div key={index} className="grid gap-2">
                  <Input name={`itemTitle${index}`} defaultValue={item.title} placeholder="Title" />
                  <Textarea
                    name={`itemBody${index}`}
                    defaultValue={item.description}
                    placeholder="Description"
                  />
                </div>
              );
            })}
            <Button type="submit">Save features</Button>
          </form>
          <form
            className="max-w-2xl space-y-2"
            action={async (formData) => {
              await upsertSiteContent("crew", {
                eyebrow: formString(formData, "eyebrow"),
                title: formString(formData, "title"),
                body: formString(formData, "body"),
              });
              toast.success("Crew saved");
              router.refresh();
            }}
          >
            <h2 className="font-semibold">Crew</h2>
            <Input name="eyebrow" defaultValue={crew.eyebrow} />
            <Input name="title" defaultValue={crew.title} />
            <Textarea name="body" defaultValue={crew.body} />
            <Button type="submit">Save crew</Button>
          </form>
          <form
            className="max-w-2xl space-y-2"
            action={async (formData) => {
              await upsertSiteContent(
                "faq",
                formString(formData, "faq")
                  .split("\n\n")
                  .map((block) => {
                    const [question, ...rest] = block.split("\n");
                    return { question: question?.trim() ?? "", answer: rest.join(" ").trim() };
                  })
                  .filter((item) => item.question),
              );
              toast.success("FAQ saved");
              router.refresh();
            }}
          >
            <h2 className="font-semibold">FAQ</h2>
            <p className="text-xs text-muted-foreground">
              One question per block. First line is the question, following lines are the answer.
              Separate items with a blank line.
            </p>
            <Textarea
              name="faq"
              rows={10}
              defaultValue={faq.map((item) => `${item.question}\n${item.answer}`).join("\n\n")}
            />
            <Button type="submit">Save FAQ</Button>
          </form>
          <form
            className="max-w-2xl space-y-2"
            action={async (formData) => {
              await upsertSiteContent("hours", formString(formData, "hours"));
              await upsertSiteContent("whatsappNumber", formString(formData, "whatsappNumber"));
              toast.success("Contact extras saved");
              router.refresh();
            }}
          >
            <h2 className="font-semibold">Hours and WhatsApp</h2>
            <Input name="hours" defaultValue={contentMap.hours ?? ""} />
            <Input name="whatsappNumber" defaultValue={contentMap.whatsappNumber ?? ""} />
            <Button type="submit">Save</Button>
          </form>
          <form
            className="max-w-2xl space-y-2"
            action={async (formData) => {
              await upsertSiteContent(
                "stats",
                formString(formData, "stats")
                  .split("\n")
                  .map((line) => {
                    const [value, ...label] = line.split("|");
                    return { value: value?.trim() ?? "", label: label.join("|").trim() };
                  })
                  .filter((item) => item.value),
              );
              toast.success("Stats saved");
              router.refresh();
            }}
          >
            <h2 className="font-semibold">Stats</h2>
            <p className="text-xs text-muted-foreground">One per line: value|label</p>
            <Textarea
              name="stats"
              rows={4}
              defaultValue={stats.map((item) => `${item.value}|${item.label}`).join("\n")}
            />
            <Button type="submit">Save stats</Button>
          </form>
          <form
            className="max-w-2xl space-y-2"
            action={async (formData) => {
              await upsertSiteContent(
                "stations",
                formString(formData, "stations")
                  .split("\n\n")
                  .map((block) => {
                    const [region, ...rest] = block.split("\n");
                    return {
                      region: region?.trim() ?? "",
                      stations: rest
                        .join(",")
                        .split(/[·,]/)
                        .map((item) => item.trim())
                        .filter(Boolean),
                    };
                  })
                  .filter((item) => item.region),
              );
              toast.success("Stations saved");
              router.refresh();
            }}
          >
            <h2 className="font-semibold">Service stations</h2>
            <p className="text-xs text-muted-foreground">
              First line is the region. Next line is stations separated by commas. Blank line
              between regions.
            </p>
            <Textarea
              name="stations"
              rows={10}
              defaultValue={stations
                .map((item) => `${item.region}\n${item.stations.join(", ")}`)
                .join("\n\n")}
            />
            <Button type="submit">Save stations</Button>
          </form>
        </TabsContent>
      </Tabs>
    </main>
  );
}

function parseDetails(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [value];
  } catch {
    return [value];
  }
}

function safeJson<T>(value: string | undefined, fallback: T): T {
  if (!value) {
    return fallback;
  }
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
