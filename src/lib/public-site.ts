import {asc, eq} from "drizzle-orm";
import {db} from "@/lib/db";
import {branch, company, siteContent, sitePricing, siteService} from "@/lib/db/schema";
import {
    BRANCHES,
    COMPANY_EMAIL,
    COMPANY_PHONES,
    COMPANY_STATS,
    SERVICE_STATIONS,
    SERVICES,
    WHATSAPP_NUMBER,
    type ServiceOffering,
} from "@/lib/data/services";
import {PRICED_SERVICES} from "@/lib/data/pricing";

function parseJson<T>(value: string | null | undefined, fallback: T): T {
    if (!value) {
        return fallback;
    }
    try {
        return JSON.parse(value) as T;
    } catch {
        return fallback;
    }
}

export async function getPublishedServices(): Promise<ServiceOffering[]> {
    try {
        const rows = await db
            .select()
            .from(siteService)
            .where(eq(siteService.published, true))
            .orderBy(asc(siteService.sort), siteService.id);
        if (rows.length === 0) {
            return SERVICES;
        }
        return rows.map((row) => ({
            slug: row.slug,
            title: row.title,
            category: row.category as ServiceOffering["category"],
            summary: row.summary,
            details: parseJson<string[]>(row.details, []),
        }));
    } catch {
        return SERVICES;
    }
}

export async function getPublicServiceBySlug(slug: string) {
    const services = await getPublishedServices();
    return services.find((item) => item.slug === slug);
}

export async function getPublicPricing() {
    try {
        const rows = await db.select().from(sitePricing);
        if (rows.length === 0) {
            return [...PRICED_SERVICES];
        }
        return rows.map((row) => ({
            slug: row.slug,
            label: row.label,
            residentialBase: row.residentialBase,
            commercialPerSqft: row.commercialPerSqft,
        }));
    } catch {
        return [...PRICED_SERVICES];
    }
}

export async function getPublicCompany() {
    try {
        const [companyRow] = await db.select().from(company).limit(1);
        const branches = companyRow ? await db.select().from(branch).where(eq(branch.companyId, companyRow.id)) : [];
        const content = await db.select().from(siteContent);
        const map = Object.fromEntries(content.map((row) => [row.key, row.value]));

        const phones = companyRow?.phone
            ? companyRow.phone.split("/").map((part) => {
                  const display = part.trim();
                  const digits = display.replace(/\D/g, "");
                  return {display, href: `tel:+${digits}`};
              })
            : [...COMPANY_PHONES];

        return {
            name: companyRow?.name ?? "UrbanPestMaster",
            address: companyRow?.address ?? "",
            email: companyRow?.email ?? COMPANY_EMAIL,
            phone: companyRow?.phone ?? COMPANY_PHONES[0].display,
            phones,
            whatsappNumber: map.whatsappNumber ?? WHATSAPP_NUMBER,
            branches: branches.length
                ? branches.map((item) => ({name: item.name, address: item.address}))
                : [...BRANCHES],
            stats: parseJson(map.stats, [...COMPANY_STATS]),
            stations: parseJson(map.stations, [...SERVICE_STATIONS]),
            hours: map.hours ?? "Mon–Sat 9:00 AM – 7:00 PM",
            hero: parseJson(map.hero, {
                eyebrow: "Mumbai to Palghar · by train or bus",
                title: "Pest-free homes and businesses, on your terms.",
                body: "Residential rates by BHK. Commercial rates by square feet.",
            }),
            about: parseJson(map.about, {
                title: "Urban Pest Master Private Limited",
                body: "Pest control for homes, societies, and commercial kitchens from Mumbai to Palghar.",
            }),
            faq: parseJson(map.faq, []),
            terms: map.terms ?? "",
        };
    } catch {
        return {
            name: "UrbanPestMaster",
            address: "",
            email: COMPANY_EMAIL,
            phone: COMPANY_PHONES[0].display,
            phones: [...COMPANY_PHONES],
            whatsappNumber: WHATSAPP_NUMBER,
            branches: [...BRANCHES],
            stats: [...COMPANY_STATS],
            stations: [...SERVICE_STATIONS],
            hours: "Mon–Sat 9:00 AM – 7:00 PM",
            hero: {
                eyebrow: "Mumbai to Palghar · by train or bus",
                title: "Pest-free homes and businesses, on your terms.",
                body: "Residential rates by BHK. Commercial rates by square feet.",
            },
            about: {
                title: "Urban Pest Master Private Limited",
                body: "Pest control for homes, societies, and commercial kitchens from Mumbai to Palghar.",
            },
            faq: [],
            terms: "",
        };
    }
}

export async function getCmsRows() {
    const [services, pricing, content, companyRow] = await Promise.all([
        db.select().from(siteService).orderBy(siteService.sort),
        db.select().from(sitePricing),
        db.select().from(siteContent),
        db.select().from(company).limit(1),
    ]);
    const branches = companyRow[0]
        ? await db.select().from(branch).where(eq(branch.companyId, companyRow[0].id))
        : [];
    return {services, pricing, content, company: companyRow[0] ?? null, branches};
}
