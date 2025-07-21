import { Router } from "express";
import { getAllGradoCiclos, getGradoCiclo, crearGradoCiclo, modificarGradoCiclo, eliminarGradoCiclo } from "../controllers/gradoCiclo.controller";
import { validarDatos } from "../middlewares/validator.middleware";
import { authWithRoles } from "../middlewares/auth.middleware";
import { ROLES } from "../utils/roles";
import { gradoCicloValidator, modificarGradoCicloValidator } from "../validators/gradoCiclo.validator";

export const gradoCicloRoute = Router();

gradoCicloRoute.get("/", authWithRoles([ROLES.ADMIN]), getAllGradoCiclos);
gradoCicloRoute.get("/:id", authWithRoles([ROLES.ADMIN]), getGradoCiclo);
gradoCicloRoute.post("/", authWithRoles([ROLES.ADMIN]), gradoCicloValidator, validarDatos, crearGradoCiclo);
gradoCicloRoute.put("/", authWithRoles([ROLES.ADMIN]), modificarGradoCicloValidator, validarDatos, modificarGradoCiclo);
gradoCicloRoute.delete("/:id", authWithRoles([ROLES.ADMIN]), eliminarGradoCiclo);
