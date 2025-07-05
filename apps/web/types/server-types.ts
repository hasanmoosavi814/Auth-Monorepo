import { z } from "zod";

export type TFormState = {
  success: boolean;
  message?: string;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
};

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(50, { message: "Name must be at most 50 characters long" })
    .trim(),

  email: z
    .string()
    .min(5, { message: "Email is required" })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Invalid email format" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-zA-Z]/, {
      message: "Password must contain at least one letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    })
    .trim(),
});

export const SigninFormSchema = z.object({
  email: z
    .string()
    .min(5, { message: "Email is required" })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Invalid email format" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-zA-Z]/, {
      message: "Password must contain at least one letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    })
    .trim(),
});
