import OrderController from "../controllers/Orders";
import { Router } from "express";

const route = Router();
const order = new OrderController();

route.post("/", order.createOrder);
route.delete("/:id", order.deleteOrder);
route.post("/pay", order.initializePayment);
route.patch("/verify", order.verifyPayment);

export default route;
