import { Router } from "express";
import { 
    crearServicio, 
    eliminarServicio, 
    getAllServicios, 
    getServicio, 
    getServiciosByGradoCiclo,
    modificarServicio 
} from "../controllers/servicio.controller";
import { validarDatos } from "../middlewares/validator.middleware";
import { servicioValidator, servicioUpdateValidator } from "../validators/servicio.validator";
import { authWithRoles } from "../middlewares/auth.middleware";
import { ROLES } from "../utils/roles";

export const servicioRoute = Router();

// Crear un nuevo servicio
servicioRoute.post("/", authWithRoles([ROLES.ADMIN]), servicioValidator, validarDatos, crearServicio);

// Obtener todos los servicios
servicioRoute.get("/", authWithRoles([ROLES.ADMIN]), getAllServicios);

// Obtener un servicio específico por ID
servicioRoute.get("/:id", authWithRoles([ROLES.ADMIN]), getServicio);

// Obtener todos los servicios de un grado ciclo específico
servicioRoute.get("/grado-ciclo/:id_grado_ciclo", authWithRoles([ROLES.ADMIN]), getServiciosByGradoCiclo);

// Modificar un servicio existente
servicioRoute.put("/:id", authWithRoles([ROLES.ADMIN]), servicioUpdateValidator, validarDatos, modificarServicio);

// Eliminar un servicio (soft delete)
servicioRoute.delete("/:id", authWithRoles([ROLES.ADMIN]), eliminarServicio);