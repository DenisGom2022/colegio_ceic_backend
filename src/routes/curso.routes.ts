import { Router } from "express";
import { getAllCursos, getCurso, crearCurso, modificarCurso, eliminarCurso } from "../controllers/curso.controller";
import { validarDatos } from "../middlewares/validator.middleware";
import { authWithRoles } from "../middlewares/auth.middleware";
import { ROLES } from "../utils/roles";
import { cursoValidator } from "../validators/curso.validator";

export const cursoRoute = Router();

cursoRoute.get("/", authWithRoles([ROLES.ADMIN]), getAllCursos);
cursoRoute.get("/:id", authWithRoles([ROLES.ADMIN]), getCurso);
cursoRoute.post("/", authWithRoles([ROLES.ADMIN]), cursoValidator, validarDatos, crearCurso);
cursoRoute.put("/", authWithRoles([ROLES.ADMIN]), cursoValidator, validarDatos, modificarCurso);
cursoRoute.delete("/:id", authWithRoles([ROLES.ADMIN]), eliminarCurso);
