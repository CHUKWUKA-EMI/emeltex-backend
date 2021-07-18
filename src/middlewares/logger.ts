import * as chalk from "chalk";
import { NextFunction, Request, Response } from "express";

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(
    `${chalk.cyan.bold("[START]")} [${chalk.blue(
      new Date().toLocaleDateString()
    )}]: ${chalk.yellow(req.method)} ${chalk.blue(req.path)}`
  );
  if (res) {
    console.log(
      `${chalk.green.bold("[END]")} [${chalk.blue(
        new Date().toLocaleDateString()
      )}]: ${chalk.yellow(req.method)} ${chalk.blue(
        req.path
      )} - ${chalk.green.bold(res.statusCode)}`
    );
  }
  next();
};

export { logger };
