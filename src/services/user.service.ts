import { Task } from "../models/task.model";
import { User } from "../models/user.model";

import type { TCreateUser } from "../types/user.types.js";

export const createUser = async (userData: TCreateUser) => {
  return await User.create(userData);
};

export const getUser = async (id: number) => {
  const users = await User.findAll({ where: { id }, include: [Task] });

  return users.length ? users[0] : null;
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
  const res = await User.destroy({ where: { id } });

  return res ? id : null;
};
