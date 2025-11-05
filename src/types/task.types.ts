import type z from "zod";
import type { taskSchema, createTaskSchema } from "../schemas/task.schemas.js";

export enum Status {
  Todo = "todo",
  InProgress = "in_progress",
  Done = "done",
}

export enum Priority {
  Low = "low",
  Medium = "medium",
  High = "high",
}

export type Filters = { status?: Status; priority?: Priority; createdAt?: Date };

export type TTask = z.infer<typeof taskSchema>;
export type TCreateTask = z.infer<typeof createTaskSchema>;
