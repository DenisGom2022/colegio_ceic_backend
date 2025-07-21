import { Router } from "express";
import { getAllAsignaciones, getAsignacion, crearAsignacion, modificarAsignacion, eliminarAsignacion } from "../controllers/asignacionCatedratico.controller";
import { validarDatos } from "../middlewares/validator.middleware";
import { authWithRoles } from "../middlewares/auth.middleware";
import { ROLES } from "../utils/roles";
import { asignacionCatedraticoValidator, modificarAsignacionCatedraticoValidator } from "../validators/asignacionCatedratico.validator";

export const asignacionCatedraticoRoute = Router();

asignacionCatedraticoRoute.get("/", authWithRoles([ROLES.ADMIN]), getAllAsignaciones);
asignacionCatedraticoRoute.get("/:id", authWithRoles([ROLES.ADMIN]), getAsignacion);
asignacionCatedraticoRoute.post("/", authWithRoles([ROLES.ADMIN]), asignacionCatedraticoValidator, validarDatos, crearAsignacion);
asignacionCatedraticoRoute.put("/", authWithRoles([ROLES.ADMIN]), modificarAsignacionCatedraticoValidator, validarDatos, modificarAsignacion);
asignacionCatedraticoRoute.delete("/:id", authWithRoles([ROLES.ADMIN]), eliminarAsignacion);
