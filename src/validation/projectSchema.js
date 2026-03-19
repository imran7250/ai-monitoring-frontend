import { z } from "zod";
export const projectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Project name is required and must be at least 3 characters")
    .max(50, "Project name cannot exceed 50 characters"),
  description: z
    .string()
    .trim()
    .max(200, "Description cannot exceed 200 characters")
    .optional()
    .or(z.literal("")),
});