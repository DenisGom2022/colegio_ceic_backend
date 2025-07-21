import { Router } from "express";
import { login, obtenerDatosToken } from "../controllers/login.controller";
import { loginValidator } from "../validators/login.validator";
import { validarDatos } from "../middlewares/validator.middleware";
import { authWithRoles } from "../middlewares/auth.middleware";
import { ROLES } from "../utils/roles";

export const loginRoute = Router();
loginRoute.post("/", loginValidator, validarDatos, login);
loginRoute.get("/datosToken", authWithRoles([ROLES.SUPERUSUARIO, ROLES.ADMIN, ROLES.DOCENTE]), obtenerDatosToken);
