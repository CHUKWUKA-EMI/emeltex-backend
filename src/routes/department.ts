import { Router } from "express";
import DepartmentController from "../controllers/Department";

const route = Router();

const department = new DepartmentController();

route.post("/seed", department.seed);
route.post("/", department.create);
route.get("/", department.getAll);
route.get("/:id", department.getOne);
route.patch("/:id", department.update);
route.delete("/:id", department.delete);

export default route;
