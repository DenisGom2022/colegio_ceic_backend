import { Router } from "express";
import { createCatedratico, getAllCatedraticos, getCatedratico, modificarCatedratico } from "../controllers/catedratico.controller";
import { catredraticoValidator } from "../validators/catedratico.validator";
import { validarDatos } from "../middlewares/validator.middleware";
import { authWithRoles } from "../middlewares/auth.middleware";
import { ROLES } from "../utils/roles";

export const catedraticoRoute = Router();

catedraticoRoute.post("/", authWithRoles([ROLES.ADMIN]), catredraticoValidator, validarDatos, createCatedratico);
catedraticoRoute.get("/", authWithRoles([ROLES.ADMIN]), getAllCatedraticos);
catedraticoRoute.get("/:id", authWithRoles([ROLES.ADMIN]), getCatedratico);
catedraticoRoute.put("/", authWithRoles([ROLES.ADMIN]), modificarCatedratico);