// src/app.ts
import express from "express";
import { AppDataSource } from "./config/data-source";

const app = express();
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("📦 Base de datos conectada");

    app.get("/", (_req, res) => {
      res.send("API funcionando 🎉");
    });

    app.listen(3000, () => {
      console.log("🚀 Servidor corriendo en http://localhost:3000");
    });
  })
  .catch((error:any) => console.error("Error al conectar DB:", error));
