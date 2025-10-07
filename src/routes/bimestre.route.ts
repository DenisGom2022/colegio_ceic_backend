import { Router } from "express";
import { finalizarSemestre, iniciarSemestre } from "../controllers/bimestre.controller";
import { authWithRoles } from "../middlewares/auth.middleware";
import { ROLES } from "../utils/roles";

export const bimestreRouter = Router();

bimestreRouter.patch("/iniciar/:id", authWithRoles([ROLES.ADMIN]), iniciarSemestre);
bimestreRouter.patch("/finalizar/:id", authWithRoles([ROLES.ADMIN]), finalizarSemestre);