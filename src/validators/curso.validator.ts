import { body } from "express-validator";

export const cursoValidator = [
    body("nombre")
        .notEmpty().withMessage("El nombre es obligatorio")
        .isString().withMessage("El nombre debe ser un texto")
        .isLength({ max: 255 }).withMessage("El nombre debe tener máximo 255 caracteres"),
    body("notaMaxima")
        .notEmpty().withMessage("La nota máxima es obligatoria")
        .isInt({ min: 0 }).withMessage("La nota máxima debe ser un número entero positivo"),
    body("notaAprobada")
        .notEmpty().withMessage("La nota aprobada es obligatoria")
        .isInt({ min: 0 }).withMessage("La nota aprobada debe ser un número entero positivo"),
    body("idGrado")
        .notEmpty().withMessage("El idGrado es obligatorio")
        .isInt().withMessage("El idGrado debe ser un número entero"),
    body("dpiCatedratico")
        .notEmpty().withMessage("El dpi de catedrático es obligatorio")
        .isInt().withMessage("El dpi de catedrático debe ser un número entero"),
    body("id")
        .optional()
        .isInt().withMessage("El id debe ser un número entero"),
];
