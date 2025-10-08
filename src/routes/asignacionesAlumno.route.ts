import { Router } from "express";
import { createAsignacionAlumno, getAllAsignacionesAlumno } from "../controllers/asignacionesAlumno.controller";
import { authWithRoles } from "../middlewares/auth.middleware";
import { ROLES } from "../utils/roles";
import { validarDatos } from "../middlewares/validator.middleware";
import { asignacionAlumnoValidator } from "../validators/asignacionAlumno.validator";

export const asignacionAlumnoRouter = Router();

asignacionAlumnoRouter.get("/", authWithRoles([ROLES.ADMIN]), getAllAsignacionesAlumno);
asignacionAlumnoRouter.post("/", asignacionAlumnoValidator, validarDatos, authWithRoles([ROLES.ADMIN]), createAsignacionAlumno);