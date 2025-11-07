import type z from "zod";
import type {
  taskSchema,
  createTaskSchema,
  updateTaskSchema,
  tasksFilterSchema,
} from "../schemas/task.schemas.js";

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

export type Filters = z.infer<typeof tasksFilterSchema>;

export type TTask = z.infer<typeof taskSchema>;
export type TCreateTask = z.infer<typeof createTaskSchema>;
export type TUpdateTask = Partial<typeof updateTaskSchema>;
