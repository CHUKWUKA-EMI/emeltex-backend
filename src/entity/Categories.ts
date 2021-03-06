import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Product } from "./Products";
import { Department } from "./Department";

@Entity({ name: "category" })
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  name: string;

  @OneToMany(() => Product, (product) => product.category, {
    eager: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  products: Product[];

  @ManyToOne(() => Department, (department) => department.categories)
  department: Department;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
