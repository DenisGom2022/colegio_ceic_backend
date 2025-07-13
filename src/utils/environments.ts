import dotenv from 'dotenv';

dotenv.config();

export const environments = {
    JWT_SECRET: process.env.JWT_SECRET || "",
    DB_HOST: process.env.DB_HOST || "",
    DB_PORT: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 0,
    DB_USERNAME: process.env.DB_USERNAME || "",
    DB_PASSWORD: process.env.DB_PASSWORD || "",
    DB_DATABASE: process.env.DB_DATABASE || "",
    PORT: process.env.PORT ? parseInt(process.env.PORT) : 3000,
}