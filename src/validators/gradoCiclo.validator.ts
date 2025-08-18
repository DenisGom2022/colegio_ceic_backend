import { body } from "express-validator";

export const gradoCicloValidator = [
    body("idGrado")
        .notEmpty().withMessage("El idGrado es obligatorio")
        .isInt({ min: 1 }).withMessage("El idGrado debe ser un número entero positivo"),
    body("idCiclo")
        .notEmpty().withMessage("El idCiclo es obligatorio")
        .isInt({ min: 1 }).withMessage("El idCiclo debe ser un número entero positivo"),
    body("precioPago")
        .notEmpty().withMessage("El precioPago es obligatorio")
        .isFloat({ min: 0 }).withMessage("El precioPago debe ser un número positivo con decimales"),
    body("cantidadPagos")
        .notEmpty().withMessage("La cantidadPagos es obligatoria")
        .isInt({ min: 1 }).withMessage("La cantidadPagos debe ser un número entero positivo"),
    body("precioInscripcion")
        .notEmpty().withMessage("El precioInscripcion es obligatorio")
        .isFloat({ min: 0 }).withMessage("El precioInscripcion debe ser un número positivo con decimales"),
    body("id")
        .optional()
        .isInt({ min: 1 }).withMessage("El id debe ser un número entero positivo"),
];

export const modificarGradoCicloValidator = [
    body("idGrado")
        .notEmpty().withMessage("El idGrado es obligatorio")
        .isInt({ min: 1 }).withMessage("El idGrado debe ser un número entero positivo"),
    body("idCiclo")
        .notEmpty().withMessage("El idCiclo es obligatorio")
        .isInt({ min: 1 }).withMessage("El idCiclo debe ser un número entero positivo"),
];

export const asignarGradoCicloActualValidator = [
    body("idGrado")
        .notEmpty().withMessage("El idGrado es obligatorio")
        .isInt({ min: 1 }).withMessage("El idGrado debe ser un número entero positivo"),
    body("precioPago")
        .notEmpty().withMessage("El precioPago es obligatorio")
        .isFloat({ min: 0 }).withMessage("El precioPago debe ser un número positivo con decimales"),
    body("cantidadPagos")
        .notEmpty().withMessage("La cantidadPagos es obligatoria")
        .isInt({ min: 1 }).withMessage("La cantidadPagos debe ser un número entero positivo"),
    body("precioInscripcion")
        .notEmpty().withMessage("El precioInscripcion es obligatorio")
        .isFloat({ min: 0 }).withMessage("El precioInscripcion debe ser un número positivo con decimales"),
];
