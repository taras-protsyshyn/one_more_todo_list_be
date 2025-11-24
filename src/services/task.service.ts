import { Op } from "sequelize";
import { getEndOfDay, getStartOfDay, isObjectEmpty } from "../utils/index";
import { Filters, TCreateTask, TUpdateTask } from "../types/task.types";
import { Task } from "../models/task.model";

const parseFilters = (filters: Filters) => {
  return {
    ...(filters.status && { status: filters.status }),
    ...(filters.priority && { priority: filters.priority }),
    ...(filters.deadline && {
      deadline: {
        [Op.between]: [
          getStartOfDay(filters.deadline),
          getEndOfDay(filters.deadline),
        ],
      },
    }),
  };
};

export const getTasks = async (filters: Filters) => {
  if (isObjectEmpty(filters)) return Task.findAll();

  return Task.findAll({
    where: parseFilters(filters),
  });
};

export const getTasksByUserId = async (userId: string, filters: Filters) => {
  return Task.findAll({
    where: { userId, ...parseFilters(filters) },
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
  const num = await Task.destroy({ where: { id } });

  return num ? id : null;
};
