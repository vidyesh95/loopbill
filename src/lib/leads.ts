import { z } from "zod";
import { isServiceSlug, PROPERTY_TYPES } from "@/lib/data/services";

export const leadRequestSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.email(),
  phone: z.string().trim().min(8).max(24),
  propertyType: z.enum(PROPERTY_TYPES),
  service: z.string().trim().refine(isServiceSlug, "Select a valid service"),
  message: z.string().trim().min(1).max(2000),
  source: z.string().trim().min(1).max(80).optional().default("contact"),
});

export type LeadRequest = z.infer<typeof leadRequestSchema>;
