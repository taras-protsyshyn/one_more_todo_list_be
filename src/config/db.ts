import { Sequelize } from "sequelize-typescript";
import { User } from "../models/user.model.js";
import { Task } from "../models/task.model.js";

export const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  port: 5432,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  models: [User, Task],
});

try {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

export default sequelize;
