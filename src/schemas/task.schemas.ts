import { z } from "zod";

import { Status, Priority } from "../types/task.types";
import { parseDate } from "../utils/date";

export const taskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title cannot be empty"),
  description: z.string().optional(),
  createdAt: z.coerce.date(),
  deadline: z.coerce.date(),
  status: z.enum(Status).default(Status.Todo).optional(),
  priority: z.enum(Priority).default(Priority.Low).optional(),
  userId: z.number(),
});

export const createTaskSchema = taskSchema.omit({
  id: true,
  createdAt: true,
  status: true,
});

export const updateTaskSchema = taskSchema.partial().omit({
  id: true,
  createdAt: true,
});

export const tasksFilterSchema = z.object({
  status: z.enum(Status).optional(),
  priority: z.enum(Priority).optional(),
  createdAt: z
    .string()
    .transform((str) => parseDate(str))
    .optional(),
});
