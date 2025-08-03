import { z } from "zod/v4";

const EmailSchema = z.email("Неверный формат email");
const UsernameSchema = z.string().min(5, "Минимум 5 символа");
const NameSchema = z.string().min(2, "Минимум 2 символа");
const PasswordSchema = z.string().min(8, "Минимум 8 символов");

export const SignInSchema = z.object({
  email: EmailSchema,
  password: z.string(),
});

export const SignUpSchema = z
  .object({
    email: EmailSchema,
    username: UsernameSchema,
    firstName: NameSchema,
    password: PasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Пароли не совпадают",
  });

export const EditEmailSchema = z.object({
  newEmail: EmailSchema,
  password: z.string(),
});

export const EditNameSchema = z.object({
  firstName: NameSchema,
  lastName: NameSchema.optional(),
});

export const EditPasswordSchema = z
  .object({
    oldPassword: z.string(),
    newPassword: PasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Пароли не совпадают",
  });

export const EditUsernameSchema = z.object({
  newUsername: UsernameSchema,
});
