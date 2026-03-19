import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address")
    .regex(
      /^[A-Za-z0-9._%+-]+@gmail\.com$/,
      "Only @gmail.com emails are allowed"
    )
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password cannot exceed 64 characters")
});
