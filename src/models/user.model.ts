import {
  AllowNull,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";

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
}
