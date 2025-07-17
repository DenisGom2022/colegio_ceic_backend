import { body } from "express-validator";

export const gradoValidator = [
    body("nombre")
        .notEmpty().withMessage("El nombre es obligatorio")
        .isString().withMessage("El nombre debe ser un texto")
        .isLength({ max: 255 }).withMessage("El nombre debe tener máximo 255 caracteres"),
    body("idNivel")
        .notEmpty().withMessage("El idNivel es obligatorio")
        .isInt().withMessage("El idNivel debe ser un número entero"),
    body("idJornada")
        .notEmpty().withMessage("El idJornada es obligatorio")
        .isInt().withMessage("El idJornada debe ser un número entero"),
    body("id")
        .optional()
        .isInt().withMessage("El id debe ser un número entero"),
];


export const modificarGradoValidator = [
    body("nombre")
        .notEmpty().withMessage("El nombre es obligatorio")
        .isString().withMessage("El nombre debe ser un texto")
        .isLength({ max: 255 }).withMessage("El nombre debe tener máximo 255 caracteres"),
    body("idNivel")
        .notEmpty().withMessage("El idNivel es obligatorio")
        .isInt().withMessage("El idNivel debe ser un número entero"),
    body("idJornada")
        .notEmpty().withMessage("El idJornada es obligatorio")
        .isInt().withMessage("El idJornada debe ser un número entero"),
    body("id")
        .notEmpty().withMessage("El id es obligatorio")
        .isInt().withMessage("El id debe ser un número entero"),
];