import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";

import { User } from "./User";

@Entity({ name: "cart" })
export class Cart extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  productName: string;

  @Column({ type: "varchar" })
  productSize: string;

  @Column({ type: "text" })
  productDescription: string;

  @Column({ type: "float" })
  productPrice: number;

  @Column({ type: "varchar" })
  productImage: string;

  @Column({ type: "integer" })
  productQuantity: number;

  @ManyToOne(() => User, (user) => user.carts, {
    eager: true,
  })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
