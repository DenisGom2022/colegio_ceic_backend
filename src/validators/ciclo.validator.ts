import { body } from "express-validator";

export const cicloValidator = [
    body("id")
        .notEmpty().withMessage("El id es obligatorio")
        .isNumeric().withMessage("El id debe ser numérico"),
    body("descripcion")
        .notEmpty().withMessage("La descripción es obligatoria")
        .isString().withMessage("La descripción debe ser un texto")
        .isLength({ max: 255 }).withMessage("La descripción debe tener máximo 255 caracteres"),
];