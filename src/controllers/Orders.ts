import { Request, Response } from "express";
import { Order } from "../entity/Orders";
import { Cart } from "../entity/Cart";
import { Product } from "../entity/Products";
import { User } from "../entity/User";
import { Payments } from "../entity/Payments";
import { validate } from "class-validator";
import Paystack from "../utilities/paystack";

class OrderController {
  async createOrder(req: Request, res: Response) {
    const { productId } = req.body;

    try {
      const product = await Product.findOneOrFail({ where: { id: productId } });
      const user = await User.findOneOrFail({
        where: { id: (<any>req).user.id },
      });
      const order = Order.create({
        delivered: false,
        product,
        user,
      });

      const errors = await validate(order);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      //persist order in database
      await order.save();

      //remove the product from cart
      await Cart.delete({ productId: productId });
      return res.status(201).json({ message: "Order created successfully" });
    } catch (error) {
      return res.status(500).json({
        message: "Oops! Something went wrong. Try again later",
        meta: error,
      });
    }
  }

  async deleteOrder(req: Request, res: Response) {
    try {
      await Order.delete({ id: Number(req.params.id) });
      return res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
      return res.status(500).json({
        message: "Oops! Something went wrong. Try again later",
        meta: error,
      });
    }
  }

  async initializePayment(req: Request, res: Response) {
    const { email, productId } = req.body;
    const reference = "emeltex" + Math.random().toString().split(".")[1];
    const paystack = new Paystack();
    try {
      const product = await Product.findOneOrFail({ where: { id: productId } });
      const user = await User.findOneOrFail({
        where: { id: (<any>req).user.id },
      });
      const { data } = await paystack.initializeTransaction(
        email,
        product.price,
        reference
      );
      if (data.status) {
        const payment = Payments.create({
          amount: product.price,
          paystack_authorization_url: data.data.authorization_url,
          paystack_transaction_code: data.data.access_code,
          productName: product.name,
          reference: data.data.reference,
          title: `Payment for ${product.name}`,
          verified: false,
          user: user,
        });
        const errors = await validate(payment);
        if (errors.length > 0) {
          return res.status(400).json({ errors });
        }

        await payment.save();
        return res.status(201).json({
          message:
            "Payment initialization successfull. Follow the paystack_authorization_url link to make your payment",
          data: payment,
        });
      }

      return res.status(403).json({ message: "Payment initialization failed" });
    } catch (error) {
      return res.status(500).json({
        message: "Oops! Something went wrong. Try again later",
        meta: error,
      });
    }
  }

  async verifyPayment(req: Request, res: Response) {
    const { reference } = req.body;
    const paystack = new Paystack();
    try {
      const { data } = await paystack.verifyPayment(reference);
      if (data.status && data.data.status === "success") {
        const user = await User.findOneOrFail({
          where: { id: (<any>req).user.id },
        });
        const updatePayment = await Payments.update(
          { verified: true },
          { reference: reference, user: user }
        );
        if (updatePayment) {
          return res.status(200).json({ message: "Payment verified" });
        }

        return res.status(403).json({
          message:
            "Something went wrong while updating payment status. However, payment has been verified",
        });
      }
      return res.status(403).json({ message: "Payment not verified" });
    } catch (error) {
      return res.status(500).json({
        message: "Oops! Something went wrong. Try again later",
        meta: error,
      });
    }
  }
}

export default OrderController;
