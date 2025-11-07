import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name cannot be empty"),
  email: z.email(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateUserSchema = userSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
