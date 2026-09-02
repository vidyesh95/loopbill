export const PROPERTY_TYPES = ["Residential", "Commercial"] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];
export type ServiceCategory = "pest" | "other";

export type ServiceOffering = {
    slug: string;
    title: string;
    category: ServiceCategory;
    summary: string;
    details: string[];
};

export const COMPANY_EMAIL = "contact@urbanpestmaster.in";
export const WHATSAPP_NUMBER = "918600139094";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const COMPANY_PHONES = [
    {display: "+91 74985 18198", href: "tel:+917498518198"},
    {display: "+91 86001 39094", href: "tel:+918600139094"},
] as const;

export const BRANCHES = [
    {
        name: "Kandivali",
        address: "Shop no. 1, Ram Bhagat Pandey Apartment, Poisar, Kandivali (E) - 400 101",
    },
    {
        name: "Virar",
        address: "Shop no. 10, Yashwant Nagar, Virar (W) - 401 303",
    },
] as const;

export const COMPANY_STATS = [
    {value: "1200+", label: "Residential services completed"},
    {value: "500+", label: "AMCs we serve"},
    {value: "3+", label: "Locations"},
] as const;

export function whatsappUrl(message?: string) {
    if (!message?.trim()) {
        return WHATSAPP_URL;
    }
    return `${WHATSAPP_URL}?text=${encodeURIComponent(message.trim())}`;
}

export const SERVICES: ServiceOffering[] = [
    {
        slug: "bedbug",
        title: "Bedbug Control",
        category: "pest",
        summary: "Eliminates bedbugs through inspection, treatment, and prevention measures.",
        details: [
            "Inspect mattresses, furniture, and hiding spots to confirm the infestation.",
            "Treat rooms with targeted insecticides and heat where needed.",
            "Advise on laundry, vacuuming, and follow-up visits so bugs do not return.",
        ],
    },
    {
        slug: "cockroach",
        title: "Cockroach Control",
        category: "pest",
        summary: "Targets cockroach populations using sanitation, baits, traps, and insecticides.",
        details: [
            "Find harbourage in kitchens, drains, and service shafts.",
            "Place gel baits and residual treatments in cracks and voids.",
            "Recommend hygiene steps that keep new colonies from settling.",
        ],
    },
    {
        slug: "mosquito",
        title: "Mosquito Control",
        category: "pest",
        summary: "Reduces mosquito populations to prevent disease using larvicides, insecticides, and breeding-site removal.",
        details: [
            "Survey terraces, tanks, planters, and standing water.",
            "Apply larvicides and adult knockdown as the site requires.",
            "Help you close breeding points so numbers stay down between visits.",
        ],
    },
    {
        slug: "rodent",
        title: "Rodent Control",
        category: "pest",
        summary: "Manages mice and rats through exclusion, traps, cleanliness, and rodenticides.",
        details: [
            "Trace droppings, gnaw marks, and entry points around the property.",
            "Set traps and, where needed, use controlled rodenticides.",
            "Seal gaps and advise on waste storage so rodents cannot get back in.",
        ],
    },
    {
        slug: "termite",
        title: "Termite Control",
        category: "pest",
        summary: "Prevents and eradicates termites using inspections, termiticides, baits, and physical barriers.",
        details: [
            "Inspect wood, soil contact, and moisture that attract termites.",
            "Treat with termiticides, baits, or a barrier around the structure.",
            "Schedule checks so hidden colonies are caught early.",
        ],
    },
    {
        slug: "wood-borer",
        title: "Wood Borer Control",
        category: "pest",
        summary: "Eradicates wood-boring insects with treatments, fumigation, and wood preservation techniques.",
        details: [
            "Identify exit holes, frass, and weakened furniture or beams.",
            "Treat timber with preservatives or fumigation when required.",
            "Protect remaining wood so a new infestation is less likely.",
        ],
    },
    {
        slug: "invisible-grill",
        title: "Invisible Grill",
        category: "other",
        summary: "Nylon-coated stainless steel balcony and window grills that stay nearly invisible while keeping children, pets, and pests out.",
        details: [
            "Measure openings and fix a taut, rust-resistant mesh.",
            "Keep views and airflow while blocking falls and birds.",
            "Use hardware suited to Mumbai weather and apartment societies.",
        ],
    },
    {
        slug: "bird-proofing",
        title: "Bird Proofing",
        category: "other",
        summary: "Humane bird netting and spikes that stop pigeons from roosting on ledges, AC units, and signage.",
        details: [
            "Map roosts, droppings, and access routes.",
            "Install nets, spikes, or wires without harming the birds.",
            "Clean affected areas and reduce the health risks of nesting.",
        ],
    },
    {
        slug: "rat-guard",
        title: "Rat Guard",
        category: "other",
        summary: "Metal guards on pipes and cables that stop rats from climbing into kitchens, shafts, and upper floors.",
        details: [
            "Fit circular guards on waste, water, and electrical risers.",
            "Close the usual climb paths from the ground or drain.",
            "Pair guards with sanitation so rodents lose food and shelter.",
        ],
    },
];

export const PEST_SERVICES = SERVICES.filter((service) => service.category === "pest");
export const OTHER_SERVICES = SERVICES.filter((service) => service.category === "other");

export function getServiceBySlug(slug: string) {
    return SERVICES.find((service) => service.slug === slug);
}

export function isServiceSlug(value: string): boolean {
    return SERVICES.some((service) => service.slug === value);
}
