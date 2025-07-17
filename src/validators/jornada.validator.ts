import { body } from "express-validator";

export const jornadaValidator = [
    body("descripcion")
        .notEmpty().withMessage("La descripción es obligatoria")
        .isString().withMessage("La descripción debe ser un texto")
        .isLength({ max: 255 }).withMessage("La descripción debe tener máximo 255 caracteres"),
    body("id")
        .optional()
        .isInt().withMessage("El id debe ser un número entero"),
];

export const modificarJornadaValidator = [
    body("descripcion")
        .notEmpty().withMessage("La descripción es obligatoria")
        .isString().withMessage("La descripción debe ser un texto")
        .isLength({ max: 255 }).withMessage("La descripción debe tener máximo 255 caracteres"),
    body("id")
        .notEmpty().withMessage("El id es obligatorio")
        .isInt().withMessage("El id debe ser un número entero"),
];
