// src/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mysql", // o postgres/sqlite
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "colegio_ceic",
  synchronize: true,
  logging: false,
  entities: [],
  migrations: ["src/migration/*.ts"],
  subscribers: [],
});