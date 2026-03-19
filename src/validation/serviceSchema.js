import { z } from "zod";

/**
 * Centralized Service Types
 * Must match backend enum exactly.
 */
export const SERVICE_TYPES = [
  "API",
  "WEBSITE",
  "MICROSERVICE",
  "SERVER",
  "DATABASE"
];

/**
 * Service Validation Schema
 */
export const serviceSchema = z.object({            
  name: z
    .string()
    .min(3, "Service name is required and must be at least 3 characters")
    .max(50, "Service name cannot exceed 50 characters"),

  baseUrl: z
    .string()
    .url("Enter a valid URL")
    .refine(url => url.startsWith("https://"), {
      message: "URL must start with https://"
    }),

  type: z.enum(SERVICE_TYPES) 
});      
