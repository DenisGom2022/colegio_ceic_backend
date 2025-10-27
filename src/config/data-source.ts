// src/config/data-source.ts
import 'dotenv/config';
import 'reflect-metadata';
import path from 'path';
import { DataSource } from 'typeorm';

const isTs = path.extname(__filename) === '.ts';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: false,
  // Carga entidades y migraciones relativas al archivo compilado
  entities: [
    path.join(__dirname, '..', 'models', `*.${isTs ? 'ts' : 'js'}`)
  ],
  migrations: [
    path.join(__dirname, '..', 'migration', `*.${isTs ? 'ts' : 'js'}`)
  ],
  subscribers: [],
});