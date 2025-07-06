import { app } from "./app";
import { AppDataSource } from "./config/data-source";

AppDataSource.initialize()
  .then(() => {
    console.log("📦 Base de datos conectada");

    app.listen(3000, () => {
      console.log("🚀 Servidor corriendo en http://localhost:3000");
    });
  })
  .catch((error:any) => console.error("Error al conectar DB:", error));
