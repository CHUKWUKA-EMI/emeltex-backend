import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
} from "typeorm";
import {
  IsEmail,
  IsBoolean,
  IsString,
  IsEnum,
  Length,
  IsAlphanumeric,
} from "class-validator";
import { Order } from "./Orders";
import { Payments } from "./Payments";
import * as bcrypt from "bcryptjs";

@Entity({ name: "users" })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  @IsString({ message: "firstName must be a string" })
  @Length(3, 20, { message: "firstName must be between 3 and 20 characters" })
  firstName: string;

  @Column({ type: "varchar" })
  @IsString({ message: "lastName must be a string" })
  @Length(3, 20, { message: "firstName must be between 3 and 20 characters" })
  lastName: string;

  @Column({ type: "varchar", unique: true })
  @IsEmail()
  email: string;

  @Column({ type: "varchar" })
  @IsAlphanumeric()
  @Length(8, 20, { message: "password must be between 8 and 20 characters" })
  password: string;

  @Column({ type: "varchar" })
  image: string;

  @Column({ type: "enum", enum: ["admin", "user"], default: "user" })
  @IsEnum(["admin", "user"])
  role: string;

  @Column({ type: "boolean" })
  @IsBoolean({ message: "Value must be a boolean" })
  verified: boolean;

  @OneToMany(() => Order, (order) => order.user, { eager: true })
  orders: Order[];

  @OneToMany(() => Payments, (Payment) => Payment.user, { eager: true })
  payments: Payments[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
