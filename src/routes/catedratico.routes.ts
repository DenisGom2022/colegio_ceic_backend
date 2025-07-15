import { Router } from "express";
import { createCatedratico, getAllCatedraticos, getCatedratico } from "../controllers/catedratico.controller";
import { createCatredraticoValidator } from "../validators/catedratico.validator";
import { validarDatos } from "../middlewares/validator.middleware";
import { authWithRoles } from "../middlewares/auth.middleware";
import { ROLES } from "../utils/roles";

export const catedraticoRoute = Router();

catedraticoRoute.post("/", authWithRoles([ROLES.ADMIN]), createCatredraticoValidator, validarDatos, createCatedratico);
catedraticoRoute.get("/", authWithRoles([ROLES.ADMIN]), getAllCatedraticos);
catedraticoRoute.get("/:id", authWithRoles([ROLES.ADMIN]), getCatedratico);