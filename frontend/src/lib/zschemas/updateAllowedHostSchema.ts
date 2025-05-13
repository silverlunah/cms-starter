import { z } from "zod";

export const updateAllowedHostSchema = z.object({
  updateDisplayName: z.string().min(1, "Display name is required"),
  updateUrl: z
    .string()
    .url("URL is invalid. Make sure to include http:// or https://"),
});

export type UpdateAllowedHostSchema = z.infer<typeof updateAllowedHostSchema>;
