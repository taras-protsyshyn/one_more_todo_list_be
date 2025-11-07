import type { Request, Response, NextFunction } from "express";

import * as service from "../services/user.service.js";
import * as schemas from "../schemas/user.schemas.js";
import { AppError } from "../errors.js";
import z from "zod";

export const getUsers = async (
  req: Request,
  res: Response,
  nex: NextFunction
) => {
  try {
    const users = await service.getUsers();
    res.send(users);
  } catch (error) {
    nex(new AppError("Could not retrieve users", 500));
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  nex: NextFunction
) => {
  try {
    const { id } = z.object({ id: z.coerce.number() }).parse(req.params);

    const user = await service.getUser(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.send(user);
  } catch (error) {
    if (error instanceof Error) {
      nex(new AppError(error.message, 400));
    }
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = schemas.createUserSchema.parse(req.body);
    const newUser = await service.createUser(userData);
    res.status(201).send(newUser);
  } catch (error) {
    if (error instanceof Error) {
      next(new AppError(error.message, 400));
    }
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = z.object({ id: z.coerce.number() }).parse(req.params);;

    const userData = schemas.updateUserSchema.parse(req.body);
    const newUser = await service.updateUser(id, userData);

    if (!newUser) {
      throw new AppError("User not found", 404);
    }

    res.status(201).send(newUser);
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    if (error instanceof Error) {
      return next(new AppError(error.message, 400));
    }
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const deletedID = await service.deleteUser(id);

    if (!deletedID) {
      throw new AppError("User not found", 404);
    }

    res.status(204).send(deletedID);
  } catch (error) {
    next(error);
  }
};
