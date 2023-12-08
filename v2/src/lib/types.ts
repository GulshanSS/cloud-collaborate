import { z } from "zod";

export const FormSchema = z.object({
  email: z
    .string()
    .describe("Email")
    .min(1, "Email is required")
    .email({ message: "Invalid Email" }),
  password: z.string().describe("Password").min(1, "Password is required"),
});

export const SignUpFormSchema = z
  .object({
    email: z
      .string()
      .describe("Email")
      .min(1, "Email is required")
      .email("Invalid Email"),
    password: z
      .string()
      .describe("Password")
      .min(6, "Password must contain at least 6 characters"),
    confirmPassword: z
      .string()
      .describe("Confirm Password")
      .min(6, "Password must contain at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
