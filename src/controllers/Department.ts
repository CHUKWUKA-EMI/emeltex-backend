import { Request, Response } from "express";
import { Department } from "../entity/Department";
import { validate } from "class-validator";
import { getConnection } from "typeorm";

class DepartmentController {
  async seed(req: Request, res: Response) {
    const { departments } = req.body;

    if (departments === undefined || !Array.isArray(departments)) {
      return res
        .status(400)
        .json({ message: "departments must an array of strings" });
    }

    try {
      const payload: any[] = [];
      departments.forEach((dept) => {
        payload.push({ name: dept });
      });

      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Department)
        .values(payload)
        .execute();
      return res.status(201).json({ message: "Database seeded successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Oops! Something went wrong. Try again later",
        meta: error,
      });
    }
  }

  async create(req: Request, res: Response) {
    const { name } = req.body;
    if ((<any>req).user.role !== "admin") {
      return res.status(403).json({
        message:
          "You don't have sufficient permissions to perform this operation. Please contact the admin",
      });
    }

    try {
      const department = Department.create({
        name: name,
      });

      const errors = await validate(department);
      if (errors.length > 0) {
        return res.status(400).json({ errors: errors });
      }
      await department.save();
      return res
        .status(201)
        .json({ message: "department created successfully", department });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Oops! Something went wrong. Try again later",
        meta: error,
      });
    }
  }
  async getAll(req: Request, res: Response) {
    if ((<any>req).user.role !== "admin") {
      return res.status(403).json({
        message:
          "You don't have sufficient permissions to perform this operation. Please contact the admin",
      });
    }
    try {
      const department = await Department.findAndCount();
      return res
        .status(200)
        .json({ department: department[0], count: department[1] });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Oops! Something went wrong. Try again later",
        meta: error,
      });
    }
  }

  async getOne(req: Request, res: Response) {
    const { id } = req.params;
    if ((<any>req).user.role !== "admin") {
      return res.status(403).json({
        message:
          "You don't have sufficient permissions to perform this operation. Please contact the admin",
      });
    }
    try {
      const department = await Department.findOne({ where: { id } });
      if (department) {
        return res.status(200).json({ department });
      }

      return res.status(404).json({ message: "Department not found" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Oops! Something went wrong. Try again later",
        meta: error,
      });
    }
  }

  async update(req: Request, res: Response) {
    if ((<any>req).user.role !== "admin") {
      return res.status(403).json({
        message:
          "You don't have sufficient permissions to perform this operation. Please contact the admin",
      });
    }

    try {
      const department = await Department.findOne({
        where: { id: req.params.id },
      });
      if (department) {
        const update = await Department.update(req.body, {
          id: Number(req.params.id),
        });
        if (update) {
          return res
            .status(200)
            .json({ message: "Department updated successfully" });
        }

        return res.status(400).json({ message: "Department not updated" });
      }

      return res.status(404).json({ message: "Department not found" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Oops! Something went wrong. Try again later",
        meta: error,
      });
    }
  }

  async delete(req: Request, res: Response) {
    if ((<any>req).user.role !== "admin") {
      return res.status(403).json({
        message:
          "You don't have sufficient permissions to perform this operation. Please contact the admin",
      });
    }

    try {
      const deleted = await Department.delete({ id: Number(req.params.id) });
      if (deleted) {
        return res
          .status(200)
          .json({ message: "Department deleted successfully" });
      }

      return res.status(404).json({ message: "Department not deleted" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Oops! Something went wrong. Try again later",
        meta: error,
      });
    }
  }
}

export default DepartmentController;
