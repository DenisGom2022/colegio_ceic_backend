import { Router } from "express";
import { getAllJornadas, getJornada, crearJornada, modificarJornada, eliminarJornada } from "../controllers/jornada.controller";
import { validarDatos } from "../middlewares/validator.middleware";
import { authWithRoles } from "../middlewares/auth.middleware";
import { ROLES } from "../utils/roles";
import { jornadaValidator, modificarJornadaValidator } from "../validators/jornada.validator";

export const jornadaRoute = Router();

jornadaRoute.get("/", authWithRoles([ROLES.ADMIN]), getAllJornadas);
jornadaRoute.get("/:id", authWithRoles([ROLES.ADMIN]), getJornada);
jornadaRoute.post("/", authWithRoles([ROLES.ADMIN]), jornadaValidator, validarDatos, crearJornada);
jornadaRoute.put("/", authWithRoles([ROLES.ADMIN]), modificarJornadaValidator, validarDatos, modificarJornada);
jornadaRoute.delete("/:id", authWithRoles([ROLES.ADMIN]), eliminarJornada);
