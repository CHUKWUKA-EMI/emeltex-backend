import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { IsNumber } from "class-validator";
import { User } from "./User";

@Entity({ name: "payments" })
export class Payments extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  title: string;

  @Column({ type: "varchar" })
  reference: string;

  @Column({ type: "float" })
  @IsNumber({ allowNaN: false, allowInfinity: false })
  amount: number;

  @Column({ type: "varchar" })
  productName: string;

  @Column({ type: "boolean" })
  verified: boolean;

  @Column({ type: "varchar" })
  paystack_transaction_code: string;

  @Column({ type: "varchar" })
  paystack_authorization_url: string;

  @ManyToOne(() => User, (user) => user.payments)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
