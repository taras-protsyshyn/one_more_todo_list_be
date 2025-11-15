import { Op } from "sequelize";
import { getEndOfDay, getStartOfDay, isObjectEmpty } from "../utils/index";
import { Filters, TCreateTask, TUpdateTask } from "../types/task.types";
import { Task } from "../models/task.model";

export const getTasks = async (filters: Filters) => {
  if (isObjectEmpty(filters)) return Task.findAll();

  return Task.findAll({
    where: {
      ...(filters.status && { status: filters.status }),
      ...(filters.priority && { priority: filters.priority }),
      ...(filters.createdAt && {
        [Op.between]: [
          getStartOfDay(filters.createdAt),
          getEndOfDay(filters.createdAt),
        ],
      }),
    },
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
