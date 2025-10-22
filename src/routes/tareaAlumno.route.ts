import { Router } from "express";
import { authWithRoles } from "../middlewares/auth.middleware";
import { ROLES } from "../utils/roles";
import { createTareaAlumno, getAllTareasAlumno } from "../controllers/tareaAlumno.controller";
import { validarDatos } from "../middlewares/validator.middleware";
import { tareaAlumnoValidator } from "../validators/tareaAlumno.validator";

export const tareaAlumnoRouter = Router();

tareaAlumnoRouter.get("/", authWithRoles([ROLES.ADMIN, ROLES.DOCENTE]), getAllTareasAlumno);
tareaAlumnoRouter.post("/", authWithRoles([ROLES.ADMIN, ROLES.DOCENTE]), tareaAlumnoValidator, validarDatos, createTareaAlumno);