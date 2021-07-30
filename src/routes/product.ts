import { Router } from "express";
import ProductController from "../controllers/Product";

const route = Router();
const product = new ProductController();

route.post("/seed", product.seed);
route.post("/", product.create);
route.get("/", product.findAll);
route.get("/:id", product.findOne);
route.patch("/:id", product.update);
route.delete("/:id", product.delete);

export default route;
