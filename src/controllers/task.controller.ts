import type { Request, Response, NextFunction } from "express";

import * as service from "../services/task.service";
import * as schemas from "../schemas/task.schemas";
import { AppError } from "../errors";

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
      nex(new AppError(error.message, 400));
    }
  }
};

export const getTasksByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const query = schemas.tasksFilterSchema.parse(req.query);

    const tasks = await service.getTasksByUserId(userId, query);

    res.send(tasks);
  } catch (error) {
    if (error instanceof Error) {
      next(new AppError(error.message, 400));
    }
  }
};

export const getTaskById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    const task = await service.getTaskById(id);

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    res.send(task);
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    if (error instanceof Error) {
      return next(new AppError(error.message, 400));
    }
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
    if (!deletedId) {
      throw new AppError("Task not found", 404);
    }

    res.status(204).send(deletedId);
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    if (error instanceof Error) {
      next(new AppError(error.message, 400));
    }
  }
};
