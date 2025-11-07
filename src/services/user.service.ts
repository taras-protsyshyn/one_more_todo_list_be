import { Task } from "../models/task.model.js";
import { User } from "../models/user.model.js";

import type { TCreateUser } from "../types/user.types.js";

export const createUser = async (userData: TCreateUser) => {
  return await User.create(userData);
};

export const getUser = async (id: number) => {
  return await User.findAll({ where: { id }, include: [Task] });
};

export const getUsers = async () => {
  return await User.findAll();
};

export const updateUser = async (
  id: number,
  userData: Partial<TCreateUser>
) => {
  await User.update(userData, { where: { id } });

  return getUser(id);
};

export const deleteUser = async (id: string) => {
  await User.destroy({ where: { id } });

  return id;
};
