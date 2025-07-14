import { Router } from "express";
import { cambiarContrasena, crearUsuario, getAllUsuarios, getUsuario, modificarUsuario } from "../controllers/usuario.controller";
import { cambiaContrasenaValidator, modificarUsuarioValidator, usuarioValidator } from "../validators/usuario.validator";
import { validarDatos } from "../middlewares/validator.middleware";
import { authWithRoles } from "../middlewares/auth.middleware";

export const usuarioRoute = Router();

export const ROLES = {
    ADMIN: 1,
    DOCENTE: 2,
};

usuarioRoute.get("/", authWithRoles([ROLES.ADMIN]), getAllUsuarios);
usuarioRoute.post("/", authWithRoles([ROLES.ADMIN]), usuarioValidator, validarDatos,  crearUsuario);
usuarioRoute.get("/:usuario", authWithRoles([ROLES.ADMIN]), getUsuario);
usuarioRoute.patch("/cambiarContrasena", cambiaContrasenaValidator, validarDatos, cambiarContrasena);
usuarioRoute.put("/", authWithRoles([ROLES.ADMIN]), modificarUsuarioValidator, validarDatos, modificarUsuario);