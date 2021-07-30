import * as express from "express";
import * as cors from "cors";
import "reflect-metadata";
import { createConnection } from "typeorm";
import * as dotenv from "dotenv";
import config from "../ormconfig";
import {
  userRoutes,
  departmentRoutes,
  categoryRoutes,
  productRoutes,
} from "./routes";
import validate from "./middlewares/authenticate";
// import { logger } from "./middlewares/logger";
import * as chalk from "chalk";

dotenv.config();

const app = express();

createConnection(config)
  .then(async (conn) => {
    console.log(`Database Connection established ${conn.name}`);
    app.use(express.json());
    app.use(express.urlencoded({ extended: false, limit: "50mb" }));
    app.use(cors());

    // app.use(logger);

    app.use(validate);

    //ROUTES
    app.use("/api/v1/user", userRoutes);
    app.use("/api/v1/department", departmentRoutes);
    app.use("/api/v1/category", categoryRoutes);
    app.use("/api/v1/products", productRoutes);

    const port = process.env.PORT || 5000;

    app.listen(port, () =>
      console.log(
        chalk.bgBlack.bold(
          `[NODE ENV: ${chalk.yellow(
            process.env.NODE_ENV
          )}][PLATFORM: ${chalk.yellow(
            process.platform
          )}] [NODEJS VERSION: ${chalk.yellow(process.version)}] [${chalk.cyan(
            new Date().toISOString()
          )}] Server listening on port ${chalk.green(port)}`
        )
      )
    );
  })
  .catch((error) => {
    console.error(error);
  });
