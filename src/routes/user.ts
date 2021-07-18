import { Router } from "express";
import UserController from "../controllers/User";

const route = Router();
const user = new UserController();
route.post("/signup", user.create);
route.get("/activate-user/:token", user.activateEmail);
route.post("/login", user.login);

export default route;
