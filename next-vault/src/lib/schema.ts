import { z } from "zod";

export const FragranceSchema = z.object({
  id: z.number().optional(), // Supabase generates this on insert
  name: z.string().min(1, "Name is required"),
  notes: z.string().min(1, "Brand is required"), // The original DB used "notes" for the brand
  family: z.array(z.string()).min(1, "Select at least one scent family"),
  type: z.string().min(1, "Type is required"),
  rating: z.number().min(1).max(5),
  scent: z.number().min(1).max(10),
  longevity: z.string(), // Stored as "9+" etc.
  sillage: z.number().min(1).max(10),
  tags: z.array(z.string()), // Generated from notes string in the form
  image: z.string().url().or(z.string().startsWith("data:image")), // Base64 or URL
  setting: z.string(),
  season: z.string().default("Year Round"),
});

export type Fragrance = z.infer<typeof FragranceSchema>;
