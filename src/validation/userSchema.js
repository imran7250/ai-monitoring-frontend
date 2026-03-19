import { z } from "zod";

export const userUpdateSchema = z.object({

  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(
      /^[A-Za-z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    )
    .refine(
      (val) => val.trim().length >= 2,
      "Name cannot be empty"
    ),

  role: z.enum(["ROLE_ADMIN", "ROLE_DEVELOPER"], {
    errorMap: () => ({
      message: "Invalid role selected"
    })
  })

});
