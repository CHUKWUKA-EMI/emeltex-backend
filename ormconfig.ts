import { ConnectionOptions } from "typeorm";
require("dotenv").config();

const ORMConfig: ConnectionOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: true,
  migrationsRun: false,
  entities: ["src/entity/**/*{.ts, .js}"],
  migrations: ["src/migration/**/*{.ts, .js}"],
  cli: {
    migrationsDir: "src/migration",
  },
};

export = ORMConfig;
