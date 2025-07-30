// src/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import { TipoUsuario } from "../models/TipoUsuario";
import { Usuario } from "../models/Usuario";
import { environments } from "../utils/environments";
import { env } from "process";

export const AppDataSource = new DataSource({
  type: "mysql", // o postgres/sqlite
  host: environments.DB_HOST,
  port: environments.DB_PORT,
  username: environments.DB_USERNAME,
  password: environments.DB_PASSWORD,
  database: environments.DB_DATABASE,
  synchronize: false,
  logging: true,
  entities: ["src/models/*.ts"],
  migrations: ["src/migration/*.ts"],
  subscribers: [],
});