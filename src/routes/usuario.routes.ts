import { Router } from "express";
import { cambiarContrasena, crearUsuario, getAllUsuarios, getUsuario, modificarUsuario, reiniciarContrasena } from "../controllers/usuario.controller";
import { cambiaContrasenaValidator, modificarUsuarioValidator, reiniciarContrasenaValidator, usuarioValidator } from "../validators/usuario.validator";
import { validarDatos } from "../middlewares/validator.middleware";
import { authWithRoles } from "../middlewares/auth.middleware";
import { ROLES } from "../utils/roles";

export const usuarioRoute = Router();

usuarioRoute.get("/", authWithRoles([ROLES.ADMIN]), getAllUsuarios);
usuarioRoute.post("/", authWithRoles([ROLES.ADMIN]), usuarioValidator, validarDatos,  crearUsuario);
usuarioRoute.post("/reiniciarContrasena", authWithRoles([ROLES.ADMIN]), reiniciarContrasenaValidator, validarDatos, reiniciarContrasena);
usuarioRoute.get("/:usuario", authWithRoles([ROLES.ADMIN]), getUsuario);
usuarioRoute.patch("/cambiarContrasena", cambiaContrasenaValidator, validarDatos, cambiarContrasena);
usuarioRoute.put("/", authWithRoles([ROLES.ADMIN]), modificarUsuarioValidator, validarDatos, modificarUsuario);