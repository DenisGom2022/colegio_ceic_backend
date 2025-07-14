import { Router } from "express";
import { login } from "../controllers/login.controller";
import { loginValidator } from "../validators/login.validator";
import { validarDatos } from "../middlewares/validator.middleware";

export const loginRoute = Router();
loginRoute.post("/", loginValidator, validarDatos, login)
