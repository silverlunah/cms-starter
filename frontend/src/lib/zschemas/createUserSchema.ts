import { z } from "zod";

export const createUserSchema = z
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
      .min(6, { message: "Password must be at least 6 characters" })
      .optional(),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // this is where the error will be shown
    message: "Passwords do not match",
  });

export type CreateUserSchema = z.infer<typeof createUserSchema>;
