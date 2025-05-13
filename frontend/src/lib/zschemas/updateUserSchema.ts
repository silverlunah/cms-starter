import { z } from "zod";

export const updateUserSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    username: z
      .string()
      .min(6, { message: "Username must be at least 6 characters" }),
    address: z.string().optional(),
    occupation: z.string().optional(),
    organization: z.string().optional(),
    email: z.string().email({ message: "Invalid email format" }),
    password: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 6, {
        message: "Password must be at least 6 characters",
      }),
    confirmPassword: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 6, {
        message: "Password must be at least 6 characters",
      }),
  })
  .refine(
    (data) => {
      if (!data.password && !data.confirmPassword) return true;
      return data.password === data.confirmPassword;
    },
    {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    },
  );

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
