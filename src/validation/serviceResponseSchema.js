// import { z } from "zod";

// export const serviceResponseSchema = z.object({
//   id: z.number(),

//   name: z
//     .string()
//     .min(1, "Service name is required")
//     .max(100, "Service name too long"),

//   baseUrl: z
//     .string()
//     .min(1, "Base URL is required"),

//   type: z
//     .string()
//     .min(1, "Service type is required"),

//   status: z
//     .string()
//     .min(1, "Service status is required"),

//   lastCheckedAt: z.any().nullable(),

//   projectId: z.number()
// });

// export const servicesResponseArraySchema = z.array(serviceResponseSchema);