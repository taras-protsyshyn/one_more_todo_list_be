import {
  AllowNull,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import { Task } from "./task.model.js";

@Table({
  tableName: "users",
})
export class User extends Model {
  @Column(DataType.STRING)
  name!: string;
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    unique: true,
  })
  email!: string;
  @HasMany(() => Task)
  tasks!: Task[];
}
