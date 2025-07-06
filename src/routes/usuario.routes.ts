import { Router } from "express";
import { getAllUsuarios } from "../controllers/usuario.controller";

export const usuarioRoute = Router();

usuarioRoute.get("/", getAllUsuarios);