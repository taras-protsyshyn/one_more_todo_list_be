import type { Request, Response, NextFunction } from "express";

import * as service from "../services/task.service.js";
import * as schemas from "../schemas/task.schemas.js";
import { AppError } from "../errors.js";

export const getTasks = async (
  req: Request,
  res: Response,
  nex: NextFunction
) => {
  try {
    const query = schemas.tasksFilterSchema.parse(req.query);
    const tasks = await service.getTasks(query);

    res.send(tasks);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      nex(new AppError(error.message, 400));
    }
  }
};

export const getTaskById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const task = await service.getTaskById(id);

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    res.send(task);
  } catch (error) {
    if (error instanceof Error) {
      return next(new AppError(error.message, 400));
    }
    next(error);
  }
};

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const taskData = schemas.createTaskSchema.parse(req.body);
    const newTask = await service.createTask(taskData);
    res.status(201).send(newTask);
  } catch (error) {
    if (error instanceof Error) {
      return next(new AppError(error.message, 400));
    }
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const taskData = schemas.updateTaskSchema.parse(req.body);
    const newTask = await service.updateTask(id, taskData);

    res.status(201).send(newTask);
  } catch (error) {
    if (error instanceof Error) {
      next(new AppError(error.message, 400));
    }
  }
};

export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const deletedId = await service.deleteTask(id);

    res.send(deletedId);
  } catch (error) {
    if (error instanceof Error) {
      next(new AppError(error.message, 400));
    }
  }
};
