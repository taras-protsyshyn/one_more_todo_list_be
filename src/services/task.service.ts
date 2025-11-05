import z from "zod";

import db from "../../db.json" with { type: "json" };
import { taskSchema } from "../schemas/task.schemas.js";
import { isObjectEmpty, isSameDate } from "../utils/index.js";
import {
  Priority,
  Status,
  type Filters,
  type TTask,
  type TCreateTask,
} from "../types/task.types.js";

const parsedTask = z.array(taskSchema).parse(db.tasks);

export const getTasks = (filters: Filters) => {
  if (isObjectEmpty(filters)) return parsedTask;

  return parsedTask.filter((task) => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.createdAt && !isSameDate(task.createdAt, filters.createdAt))
      return false;
    return true;
  });
};

export const getTaskById = (id: string) => {
  return parsedTask.find((task) => task.id === id);
};

export const createTask = (taskData: TCreateTask) => {
  const newTask: TTask = {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    status: Status.Todo,
    priority: Priority.Low,
    ...taskData,
  };

  parsedTask.push(newTask);

  return newTask;
};

export const updateTask = (id: string, taskData: TTask) => {
  const taskIndex = parsedTask.findIndex((task) => task.id === id);

  const updatedTask = { ...parsedTask[taskIndex], ...taskData };

  parsedTask[taskIndex] = updatedTask;

  return updatedTask;
};

export const deleteTask = (id: string) => {
  const taskIndex = parsedTask.findIndex((task) => task.id === id);
  if (taskIndex === -1) return taskIndex;

  parsedTask.splice(taskIndex, 1);

  return id;
};
