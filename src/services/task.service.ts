import { Op } from "sequelize";
import { getEndOfDay, getStartOfDay, isObjectEmpty } from "../utils/index.js";
import {
  type Filters,
  type TCreateTask,
  type TUpdateTask,
} from "../types/task.types.js";
import { Task } from "../models/task.model.js";

export const getTasks = async (filters: Filters) => {
  if (isObjectEmpty(filters)) return Task.findAll();

  const whereConditions: any = {};

  if (filters.status) {
    whereConditions.status = filters.status;
  }

  if (filters.priority) {
    whereConditions.priority = filters.priority;
  }

  if (filters.createdAt) {
    whereConditions.createdAt = {
      [Op.between]: [
        getStartOfDay(filters.createdAt),
        getEndOfDay(filters.createdAt),
      ],
    };
  }

  return Task.findAll({
    where: whereConditions,
  });
};

export const getTaskById = async (id: string) => {
  return Task.findOne({ where: { id } });
};

export const createTask = async (taskData: TCreateTask) => {
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
