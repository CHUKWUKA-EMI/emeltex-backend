import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { IsBoolean } from "class-validator";
import { Product } from "./Products";

import { User } from "./User";

@Entity({ name: "order" })
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "boolean" })
  @IsBoolean()
  delivered: boolean;

  @ManyToOne(() => Product, (product) => product.orders)
  product: Product;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
