import { Router } from "express";
import { authWithRoles } from "../middlewares/auth.middleware";
import { ROLES } from "../utils/roles";
import { createPago, getPagos } from "../controllers/pago.controller";
import { getPagosValidator, pagoValidator } from "../validators/pago.validador";
import { validarDatos } from "../middlewares/validator.middleware";

export const pagoRouter = Router();

pagoRouter.get("/", authWithRoles([ROLES.ADMIN]), getPagosValidator, validarDatos, getPagos);
pagoRouter.post("/", authWithRoles([ROLES.ADMIN]), pagoValidator, validarDatos, createPago);