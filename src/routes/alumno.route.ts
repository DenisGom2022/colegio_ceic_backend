import { Router } from "express";
import { crearAlumno, getAllAlumnos } from "../controllers/alumno.controller";
import { validarDatos } from "../middlewares/validator.middleware";
import { createAlumnoValidator } from "../validators/alumno.validator";

export const alumnoRoute = Router();

alumnoRoute.post("/", createAlumnoValidator, validarDatos, crearAlumno);
alumnoRoute.get("/", getAllAlumnos);