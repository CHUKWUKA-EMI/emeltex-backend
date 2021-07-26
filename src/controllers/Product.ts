import { Request, Response } from "express";
import { Product } from "../entity/Products";
import { validate } from "class-validator";

class ProductController {
  async create(req: Request, res: Response): Promise<Product | any> {
    const { name, description, size, price, imageUrl } = req.body;
    if ((<any>req).user.role !== "admin") {
      return res.status(403).json({
        message:
          "You don't have sufficient permissions to perform this operation. Please contact the admin",
      });
    }
    try {
      const product = Product.create({
        name,
        description,
        size,
        price,
        imageUrl,
      });
      const errors = await validate(product);
      if (errors.length > 0) {
        return res.status(400).json({ errors: errors });
      }

      await product.save();
      return res.status(201).json({ product });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Oops! Something went wrong. Try again later",
        meta: error,
      });
    }
  }

  async findAll(req: Request, res: Response): Promise<Product[] | any> {
    if ((<any>req).user.role !== "admin") {
      return res.status(403).json({
        message:
          "You don't have sufficient permissions to perform this operation. Please contact the admin",
      });
    }

    try {
      const products = await Product.find();
      return res.status(200).json({ products });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Oops! Something went wrong. Try again later",
        meta: error,
      });
    }
  }
  async findOne(req: Request, res: Response): Promise<Product | any> {
    if ((<any>req).user.role !== "admin") {
      return res.status(403).json({
        message:
          "You don't have sufficient permissions to perform this operation. Please contact the admin",
      });
    }

    try {
      const product = await Product.findOne({ where: { id: req.params.id } });
      if (product) {
        return res.status(200).json({ product });
      }

      return res.status(404).json({ message: "Product not found" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Oops! Something went wrong. Try again later",
        meta: error,
      });
    }
  }

  async update(req: Request, res: Response): Promise<Product | any> {
    if ((<any>req).user.role !== "admin") {
      return res.status(403).json({
        message:
          "You don't have sufficient permissions to perform this operation. Please contact the admin",
      });
    }

    try {
      const product = await Product.findOne({ where: { id: req.params.id } });
      if (product) {
        const updated = await Product.update(req.body, { id: req.params.id });
        if (updated) {
          return res
            .status(200)
            .json({ message: "Product updated successfully", product });
        }

        return res.status(403).json({ message: "Product update failed" });
      }
      return res.status(404).json({ message: "Product not found" });
    } catch (error) {
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
      const product = await Product.findOne({ where: { id: req.params.id } });
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const deleted = await Product.delete({ id: req.params.id });
      if (deleted) {
        return res
          .status(200)
          .json({ message: "Product deleted successfully" });
      }
      return res.status(403).json({ message: "Product deletion failed" });
    } catch (error) {
      return res.status(500).json({
        message: "Oops! Something went wrong. Try again later",
        meta: error,
      });
    }
  }
}

export default ProductController;
