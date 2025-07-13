import { Router } from "express";
import { crearUsuario, getAllUsuarios } from "../controllers/usuario.controller";
import { usuarioValidator } from "../validators/usuario.validator";
import { validarDatos } from "../middlewares/validator.middleware";
import { authWithRoles } from "../middlewares/auth.middleware";

export const usuarioRoute = Router();

export const ROLES = {
    ADMIN: 1,
    DOCENTE: 2,
};

usuarioRoute.use(authWithRoles([ROLES.ADMIN]));
usuarioRoute.get("/",  getAllUsuarios);
usuarioRoute.post("/", usuarioValidator, validarDatos,  crearUsuario);