import { Router } from "express";
import { createTarea, getAllMisTareas, getAllTareas } from "../controllers/tarea.controller";
import { authWithRoles } from "../middlewares/auth.middleware";
import { ROLES } from "../utils/roles";
import { tareaValidator } from "../validators/tarea.validator";
import { validarDatos } from "../middlewares/validator.middleware";

export const tareaRouter = Router();

tareaRouter.get("/", authWithRoles([ROLES.ADMIN]),  getAllTareas);
tareaRouter.get("/mis-tareas", authWithRoles([ROLES.ADMIN, ROLES.DOCENTE]),  getAllMisTareas);
tareaRouter.post("/", authWithRoles([ROLES.ADMIN, ROLES.DOCENTE]), tareaValidator, validarDatos, createTarea);