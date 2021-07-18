import { Request, Response } from "express";
import { User } from "../entity/User";
import * as jwt from "jsonwebtoken";
import { validate } from "class-validator";
import Email from "../utilities/email";
import * as bcrypt from "bcryptjs";

class UserController {
  //create user
  async create(req: Request, res: Response) {
    const { firstName, lastName, email, password } = req.body;
    try {
      const user = User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        verified: false,
        image: "",
        role: "user",
      });
      const errors = await validate(user);
      if (errors.length > 0) {
        return res.status(400).json({ errors: errors });
      }

      await user.save();
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "24h",
      });
      const url = `${process.env.BACKEND_URL}/user/activate-user/${token}`;
      const emailClass = new Email();
      const message = emailClass.constructWelcomeEmail(
        user.firstName,
        url,
        "Email Confirmation"
      );
      await emailClass.sendEmail(email, "Email Confirmation", message);
      const userData = { ...user };
      delete (<any>userData).password;
      return res.status(201).json({ user: userData, access_token: token });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Oops! Something went wrong. Try again later" });
    }
  }

  async activateEmail(req: Request, res: Response) {
    const token = req.params.token;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      const id = (<any>decoded).id;
      if (!id) {
        throw new Error("Invalid token");
      }
      const user = await User.findOne(id);
      if (!user) {
        throw new Error("User does not exist. Register again");
      }

      await User.update(user.id, { verified: true });
      return res.redirect(process.env.FRONTEND_URL!);
    } catch (error) {
      throw new Error(error);
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      //validate email and password
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      //Check if the email has been verified
      if (!user.verified) {
        return res.status(401).json({ message: "Please verify your email" });
      }
      //generate token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "7d",
      });
      //assign token to response header
      res.header("Authorization", token);

      //remove password from response payload
      const userData = { ...user };
      delete (<any>userData).password;

      return res.status(200).json({
        message: "Login successful",
        user: userData,
        refresh_token: token,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Oops! Something went wrong. Try again later" });
    }
  }
}

export default UserController;
