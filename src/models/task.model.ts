import {
  AllowNull,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";
import { Priority, Status } from "../types/task.types.js";

@Table({
  tableName: "tasks",
})
export class Task extends Model {
  @AllowNull(false)
  @Column(DataType.STRING)
  title!: string;
  @Column(DataType.STRING)
  description!: string;
  @Column(DataType.DATE)
  deadline!: Date;
  @Column({
    type: DataType.ENUM(...Object.values(Status)),
    defaultValue: Status.Todo,
  })
  status!: Status;
  @Column({
    type: DataType.ENUM(...Object.values(Priority)),
    defaultValue: Priority.Low,
  })
  priority!: Priority;
}
