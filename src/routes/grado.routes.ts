import { Router } from "express";
import { getAllGrados, getGrado, crearGrado, modificarGrado, eliminarGrado, asignarGradoACicloActual } from "../controllers/grado.controller";
import { gradoValidator, modificarGradoValidator } from "../validators/grado.validator";
import { validarDatos } from "../middlewares/validator.middleware";
import { authWithRoles } from "../middlewares/auth.middleware";
import { ROLES } from "../utils/roles";
import { asignarGradoCicloActualValidator } from "../validators/gradoCiclo.validator";

export const gradoRoute = Router();

gradoRoute.get("/", authWithRoles([ROLES.ADMIN]), getAllGrados);
gradoRoute.get("/:id", authWithRoles([ROLES.ADMIN]), getGrado);
gradoRoute.post("/", authWithRoles([ROLES.ADMIN]), gradoValidator, validarDatos, crearGrado);
gradoRoute.put("/", authWithRoles([ROLES.ADMIN]), modificarGradoValidator, validarDatos, modificarGrado);
gradoRoute.delete("/:id", authWithRoles([ROLES.ADMIN]), eliminarGrado);
gradoRoute.post("/asignar-ciclo-actual", authWithRoles([ROLES.ADMIN]), asignarGradoCicloActualValidator, validarDatos, asignarGradoACicloActual);
