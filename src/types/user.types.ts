export type TUser = {
  id: string;
  name: string;
  email: string;
};

export type TCreateUser = Omit<TUser, "id">;
