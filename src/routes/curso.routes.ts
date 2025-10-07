import { Router } from "express";
import { getAllCursos, getCurso, crearCurso, modificarCurso, eliminarCurso, getAllMisCursos, getMiCurso, getAllMisCursosActivos } from "../controllers/curso.controller";
import { validarDatos } from "../middlewares/validator.middleware";
import { authWithRoles } from "../middlewares/auth.middleware";
import { ROLES } from "../utils/roles";
import { cursoValidator, modificarCursoValidator } from "../validators/curso.validator";

export const cursoRoute = Router();

cursoRoute.get("/", authWithRoles([ROLES.ADMIN]), getAllCursos);
cursoRoute.get("/mis-cursos",  authWithRoles([ROLES.ADMIN, ROLES.DOCENTE]), getAllMisCursos);
cursoRoute.get("/activos",  authWithRoles([ROLES.ADMIN, ROLES.DOCENTE]), getAllMisCursosActivos);
cursoRoute.get("/mis-cursos/:id",  authWithRoles([ROLES.ADMIN, ROLES.DOCENTE]), getMiCurso);
cursoRoute.get("/:id", authWithRoles([ROLES.ADMIN]), getCurso);
cursoRoute.post("/", authWithRoles([ROLES.ADMIN]), cursoValidator, validarDatos, crearCurso);
cursoRoute.put("/", authWithRoles([ROLES.ADMIN]), modificarCursoValidator, validarDatos, modificarCurso);
cursoRoute.delete("/:id", authWithRoles([ROLES.ADMIN]), eliminarCurso);
