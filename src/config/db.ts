import { Sequelize } from "sequelize-typescript";
import { User } from "../models/user.model";
import { Task } from "../models/task.model";

interface DBConfig {
  [key: string]: {
    dialect: "postgres" | "sqlite";
    host?: string | undefined;
    port?: number | undefined;
    database?: string | undefined;
    username?: string | undefined;
    password?: string | undefined;
    storage?: string | undefined;
  };
}

const dbConfig: DBConfig = {
  development: {
    dialect: "postgres",
    host: process.env.DB_HOST,
    port: 5432,
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  test: {
    dialect: "sqlite",
    storage: ":memory:",
  },
};

const sequelize = new Sequelize({
  ...dbConfig[process.env.NODE_ENV || "development"],
  models: [User, Task],
});

export default sequelize;
