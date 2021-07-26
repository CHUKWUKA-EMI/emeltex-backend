import { Router } from "express";
import CategoryController from "../controllers/Category";

const route = Router();
const category = new CategoryController();

route.post("/seed", category.seed);
route.post("/", category.create);
route.get("/", category.getAll);
route.get("/:id", category.getOne);
route.patch("/:id", category.update);
route.delete("/:id", category.delete);

export default route;
