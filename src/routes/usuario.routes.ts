import { Router } from "express";
import { crearUsuario, getAllUsuarios } from "../controllers/usuario.controller";
import { usuarioValidator } from "../validators/usuario.validator";
import { validarDatos } from "../middlewares/validator.middleware";

export const usuarioRoute = Router();

usuarioRoute.get("/", getAllUsuarios);
usuarioRoute.post("/", usuarioValidator, validarDatos,  crearUsuario);