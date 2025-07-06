// src/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import { TipoUsuario } from "../models/TipoUsuario";
import { Usuario } from "../models/Usuario";

export const AppDataSource = new DataSource({
  type: "mysql", // o postgres/sqlite
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "colegio_ceic",
  synchronize: false,
  logging: true,
  entities: ["src/models/*.ts"],
  migrations: ["src/migration/*.ts"],
  subscribers: [],
});