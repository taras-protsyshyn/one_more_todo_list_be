import { User } from "../models/user.model.js";

import type { TCreateUser } from "../types/user.types.js";

export const createUser = async (userData: TCreateUser) => {
  const user = await User.create(userData);

  return user;
};

export const getUser = async (id: string) => {
  const user = await User.findByPk(id);
  return user;
};

export const getUsers = async () => {
  const users = await User.findAll();

  return users;
};

export const updateUser = async (
  id: string,
  userData: Partial<TCreateUser>
) => {
  const user = await getUser(id);

  if (!user) {
    return null;
  }

  await user.update(userData);

  return user;
};

export const deleteUser = async (id: string) => {
  const user = await getUser(id);

  if (!user) {
    return null;
  }

  await user.destroy();

  return id;
};
