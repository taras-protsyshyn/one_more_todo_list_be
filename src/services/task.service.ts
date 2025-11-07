import { isObjectEmpty } from "../utils/index.js";
import {
  Priority,
  Status,
  type Filters,
  type TTask,
  type TCreateTask,
  type TUpdateTask,
} from "../types/task.types.js";
import { Task } from "../models/task.model.js";

export const getTasks = async (filters: Filters) => {
  if (isObjectEmpty(filters)) return Task.findAll();

  return Task.findAll({
    where: {
      ...(filters.status && { status: filters.status }),
      ...(filters.priority && { priority: filters.priority }),
      ...(filters.createdAt && { createdAt: filters.createdAt }),
    },
  });
};

export const getTaskById = async (id: string) => {
  return Task.findOne({ where: { id } });
};

export const createTask = async (taskData: TCreateTask) => {
  const newTask: TTask = {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    status: Status.Todo,
    priority: Priority.Low,
    ...taskData,
  };

  return Task.create(taskData);
};

export const updateTask = async (id: string, taskData: TUpdateTask) => {
  await Task.update(taskData, { where: { id } });

  return getTaskById(id);
};

export const deleteTask = async (id: string) => {
  await Task.destroy({ where: { id } });
  return id;
};
