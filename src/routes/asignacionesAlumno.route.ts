import { Router } from "express";
import { createAsignacionAlumno, getAllAsignacionesAlumno, getAsignacion, getAsignacionesAlumnoPaginado, updateAsignacion } from "../controllers/asignacionesAlumno.controller";
import { authWithRoles } from "../middlewares/auth.middleware";
import { ROLES } from "../utils/roles";
import { validarDatos } from "../middlewares/validator.middleware";
import { asignacionAlumnoValidator, updateAsignacionValidator } from "../validators/asignacionAlumno.validator";

export const asignacionAlumnoRouter = Router();

asignacionAlumnoRouter.get("/", authWithRoles([ROLES.ADMIN]), getAllAsignacionesAlumno);
asignacionAlumnoRouter.get("/pag", authWithRoles([ROLES.ADMIN]), getAsignacionesAlumnoPaginado);
asignacionAlumnoRouter.get("/:id", authWithRoles([ROLES.ADMIN]), getAsignacion)
asignacionAlumnoRouter.post("/", asignacionAlumnoValidator, validarDatos, authWithRoles([ROLES.ADMIN]), createAsignacionAlumno);
asignacionAlumnoRouter.put("/:id", authWithRoles([ROLES.ADMIN]), updateAsignacionValidator, validarDatos, updateAsignacion);