import { Request, Response } from "express";
import { Product } from "../entity/Products";
import { validate } from "class-validator";
import { Category } from "../entity/Categories";
import { getConnection } from "typeorm";

interface ProductRequest {
  name: string;
  description: string;
  size: string;
  price: number;
  imageUrl: string;
}

class ProductController {
  async seed(req: Request, res: Response) {
    const { products, categoryName } = req.body;
    if (products === undefined || !Array.isArray(products)) {
      return res
        .status(400)
        .json({ message: "products must an array of strings" });
    }
    try {
      const category = await Category.findOne({
        where: { name: categoryName },
      });
      if (category) {
        const payload: any[] = [];
        products.map(
          ({ name, description, size, price, imageUrl }: ProductRequest) => {
            payload.push({
              name: name,
              description: description,
              size: size,
              price: price,
              imageUrl: imageUrl,
              category: category,
            });
          }
        );
        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(Product)
          .values(payload)
          .execute();

        return res
          .status(201)
          .json({ message: "Database seeded successfully" });
      }

      return res
        .status(404)
        .json({ message: `Category with name ${categoryName} not found` });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Oops! Something went wrong. Try again later",
        meta: error,
      });
    }
  }
  async create(req: Request, res: Response): Promise<Product | any> {
    const { name, description, size, price, imageUrl, categoryName } = req.body;
    if ((<any>req).user.role !== "admin") {
      return res.status(403).json({
        message:
          "You don't have sufficient permissions to perform this operation. Please contact the admin",
      });
    }
    try {
      const category = await Category.findOne({
        where: { name: categoryName },
      });
      if (category) {
        const product = Product.create({
          name,
          description,
          size,
          price,
          imageUrl,
          category: category,
        });
        const errors = await validate(product);
        if (errors.length > 0) {
          return res.status(400).json({ errors: errors });
        }

        await product.save();
        return res.status(201).json({ product });
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
