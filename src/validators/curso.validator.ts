import { body } from "express-validator";

export const cursoValidator = [
    body("nombre")
        .notEmpty().withMessage("El nombre es obligatorio")
        .isString().withMessage("El nombre debe ser un texto")
        .isLength({ max: 255 }).withMessage("El nombre debe tener máximo 255 caracteres"),
    body("id")
        .optional()
        .isInt().withMessage("El id debe ser un número entero"),
];
