import { z } from "zod";

export const createAllowedHostSchema = z.object({
  createDisplayName: z.string().min(1, "Display name is required"),
  createUrl: z
    .string()
    .url("URL is invalid. Make sure to include http:// or https://"),
});

export type CreateAllowedHostSchema = z.infer<typeof createAllowedHostSchema>;
