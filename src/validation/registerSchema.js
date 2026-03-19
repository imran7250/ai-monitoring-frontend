import { z } from "zod";

export const registerSchema = z.object({

  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .regex(
      /^[a-zA-Z\s]+$/,
      "Name can only contain letters and spaces"
    ),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address")
    .regex(
      /^[A-Za-z0-9._%+-]+@gmail\.com$/,
      "Only @gmail.com emails are allowed"
    )
    .transform((val) => val.toLowerCase()),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password cannot exceed 64 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Password must contain uppercase, lowercase, number and special character"
    )

});
