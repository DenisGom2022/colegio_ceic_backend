import { Router } from "express";
import * as tipoParentescoController from "../controllers/tipoParentesco.controller";
import { authWithRoles } from "../middlewares/auth.middleware";
import { validarDatos } from "../middlewares/validator.middleware";
import { tipoParentescoValidator } from "../validators/tipoParentesco.validator";

const router = Router();

// Se usa authWithRoles([]) para permitir acceso a cualquier rol autenticado
router.get("/", authWithRoles([]), tipoParentescoController.getAllTiposParentesco);
router.get("/:id", authWithRoles([]), tipoParentescoController.getTipoParentesco);
router.post("/", authWithRoles([]), tipoParentescoValidator, validarDatos, tipoParentescoController.crearTipoParentesco);
router.put("/:id", authWithRoles([]), tipoParentescoValidator, validarDatos, tipoParentescoController.modificarTipoParentesco);
router.delete("/:id", authWithRoles([]), tipoParentescoController.eliminarTipoParentesco);

export default router;
