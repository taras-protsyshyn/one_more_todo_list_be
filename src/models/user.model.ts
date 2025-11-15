import {
  AllowNull,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import { Task } from "./task.model";

@Table({
  tableName: "users",
})
export class User extends Model {
  @Column(DataType.STRING)
  declare name: string;
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    unique: true,
  })
  declare email: string;
  @HasMany(() => Task)
  tasks!: Task[];
}
