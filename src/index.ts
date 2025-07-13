import { app } from "./app";
import { AppDataSource } from "./config/data-source";
import { environments } from "./utils/environments";

const PORT = environments.PORT;

AppDataSource.initialize()
  .then(() => {
    console.log("📦 Base de datos conectada");

    app.listen(PORT, () => {
      console.log("🚀 Servidor corriendo en http://localhost:3000");
    });
  })
  .catch((error:any) => console.error("Error al conectar DB:", error));
