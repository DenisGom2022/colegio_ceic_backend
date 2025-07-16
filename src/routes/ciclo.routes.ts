import { Router } from "express";
import { getAllCiclos, getCiclo, crearCiclo, modificarCiclo, eliminarCiclo } from "../controllers/ciclo.controller";
import { validarDatos } from "../middlewares/validator.middleware";
import { authWithRoles } from "../middlewares/auth.middleware";
import { ROLES } from "../utils/roles";
import { cicloValidator } from "../validators/ciclo.validator";

export const cicloRoute = Router();

cicloRoute.get("/", authWithRoles([ROLES.ADMIN]), getAllCiclos);
cicloRoute.get("/:id", authWithRoles([ROLES.ADMIN]), getCiclo);
cicloRoute.post("/", authWithRoles([ROLES.ADMIN]), cicloValidator, validarDatos, crearCiclo);
cicloRoute.put("/", authWithRoles([ROLES.ADMIN]), cicloValidator, validarDatos, modificarCiclo);
cicloRoute.delete("/:id", authWithRoles([ROLES.ADMIN]), eliminarCiclo);
