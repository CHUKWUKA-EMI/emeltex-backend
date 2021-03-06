import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Category } from "./Categories";
import { Order } from "./Orders";

@Entity({ name: "product" })
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "varchar" })
  size: string;

  @Column({ type: "float" })
  price: number;

  @Column({ type: "varchar" })
  imageUrl: string;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @OneToMany(() => Order, (order) => order.product, { eager: true })
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
