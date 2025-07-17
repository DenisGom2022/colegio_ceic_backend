import { Router } from "express";
import { getAllNivelAcademico, getNivelAcademico, crearNivelAcademico, modificarNivelAcademico, eliminarNivelAcademico } from "../controllers/nivelAcademico.controller";
import { validarDatos } from "../middlewares/validator.middleware";
import { authWithRoles } from "../middlewares/auth.middleware";
import { ROLES } from "../utils/roles";
import { nivelAcademicoValidator } from "../validators/nivelAcademico.validator";

export const nivelAcademicoRoute = Router();

nivelAcademicoRoute.get("/", authWithRoles([ROLES.ADMIN]), getAllNivelAcademico);
nivelAcademicoRoute.get("/:id", authWithRoles([ROLES.ADMIN]), getNivelAcademico);
nivelAcademicoRoute.post("/", authWithRoles([ROLES.ADMIN]), nivelAcademicoValidator, validarDatos, crearNivelAcademico);
nivelAcademicoRoute.put("/", authWithRoles([ROLES.ADMIN]), nivelAcademicoValidator, validarDatos, modificarNivelAcademico);
nivelAcademicoRoute.delete("/:id", authWithRoles([ROLES.ADMIN]), eliminarNivelAcademico);
