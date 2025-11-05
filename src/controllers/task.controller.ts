import type { Request, Response, NextFunction } from "express";

import * as service from "../services/task.service.js";
import * as schemas from "../schemas/task.schemas.js";
import { AppError } from "../errors.js";

export const getTasks = (req: Request, res: Response, nex: NextFunction) => {
  try {
    const query = schemas.tasksFilterSchema.parse(req.query);

    res.send(service.getTasks(query));
  } catch (error) {
    nex(new AppError("Invalid query parameters", 400));
  }
};

export const getTaskById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const task = service.getTaskById(id);

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    res.send(task);
  } catch (error) {
    next(error);
  }
};

export const createTask = (req: Request, res: Response, next: NextFunction) => {
  try {
    const taskData = schemas.createTaskSchema.parse(req.body);
    const newTask = service.createTask(taskData);
    res.status(201).send(newTask);
  } catch (error) {
    next(new AppError("Invalid task data", 400));
  }
};

export const updateTask = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const task = service.getTaskById(id);

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    const taskData = schemas.taskSchema.parse(req.body);
    const newTask = service.updateTask(id, taskData);

    res.status(201).send(newTask);
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    next(new AppError("Invalid task data", 400));
  }
};

export const deleteTask = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const deletedId = service.deleteTask(id);
    if (deletedId === -1) {
      throw new AppError("Task not found", 404);
    }
    res.send(deletedId);
  } catch (error) {
    next(error);
  }
};
