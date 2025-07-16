import { Router } from "express";
import { crearAlumno, getAllAlumnos, getAlumno, modificarAlumno } from "../controllers/alumno.controller";
import { validarDatos } from "../middlewares/validator.middleware";
import { alumnoValidator } from "../validators/alumno.validator";
import { authWithRoles } from "../middlewares/auth.middleware";
import { ROLES } from "../utils/roles";

export const alumnoRoute = Router();

alumnoRoute.post("/", authWithRoles([ROLES.ADMIN]), alumnoValidator, validarDatos, crearAlumno);
alumnoRoute.get("/", authWithRoles([ROLES.ADMIN]), getAllAlumnos);
alumnoRoute.get("/:cui", authWithRoles([ROLES.ADMIN]), getAlumno);
alumnoRoute.put("/", authWithRoles([ROLES.ADMIN]), alumnoValidator, validarDatos, modificarAlumno);