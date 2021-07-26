import { Request, Response } from "express";
import { Category } from "../entity/Categories";
import { Department } from "../entity/Department";
import { validate } from "class-validator";
import { getConnection } from "typeorm";

class CategoryController {
  async seed(req: Request, res: Response) {
    const { categories, departmentName } = req.body;
    if (categories === undefined || !Array.isArray(categories)) {
      return res
        .status(400)
        .json({ message: "categories must an array of strings" });
    }
    try {
      const department = await Department.findOne({
        where: { name: departmentName },
      });
      if (department) {
        const payload: any[] = [];
        categories.forEach((cat) => {
          payload.push({ name: cat, department: department });
        });

        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(Category)
          .values(payload)
          .execute();

        return res
          .status(201)
          .json({ message: "Database seeded successfully" });
      }

      return res
        .status(404)
        .json({ message: `Department with name ${departmentName} not found` });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Oops! Something went wrong. Try again later",
        meta: error,
      });
    }
  }
  async create(req: Request, res: Response) {
    const { name, departmentName } = req.body;
    if ((<any>req).user.role !== "admin") {
      return res.status(403).json({
        message:
          "You don't have sufficient permissions to perform this operation. Please contact the admin",
      });
    }

    try {
      const department = await Department.findOne({
        where: { name: departmentName },
      });
      if (department) {
        const category = Category.create({
          name: name,
          department: department,
        });

        const errors = await validate(category);
        if (errors.length > 0) {
          return res.status(400).json({ errors: errors });
        }
        await category.save();
        await department.save();
        return res
          .status(201)
          .json({ message: "Category created successfully", category });
      }
      return res
        .status(404)
        .json({ message: `Department with name ${departmentName} not found` });
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
      const categories = await Category.findAndCount();
      return res
        .status(200)
        .json({ categories: categories[0], count: categories[1] });
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
      const category = await Category.findOne({ where: { id } });
      if (category) {
        return res.status(200).json({ category: category });
      }

      return res.status(404).json({ message: "Category not found" });
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
      const category = await Category.findOne({ where: { id: req.params.id } });
      if (category) {
        const update = await Category.update(req.body, {
          id: Number(req.params.id),
        });
        if (update) {
          return res
            .status(200)
            .json({ message: "Category updated successfully" });
        }

        return res.status(400).json({ message: "Category not updated" });
      }

      return res.status(404).json({ message: "Category not found" });
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
      const deleted = await Category.delete({ id: Number(req.params.id) });
      if (deleted) {
        return res
          .status(200)
          .json({ message: "Category deleted successfully" });
      }

      return res.status(404).json({ message: "Category not deleted" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Oops! Something went wrong. Try again later",
        meta: error,
      });
    }
  }
}

export default CategoryController;
