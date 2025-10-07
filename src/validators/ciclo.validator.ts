import { body } from "express-validator";

export const cicloValidator = [
    body("id")
        .notEmpty().withMessage("El id es obligatorio")
        .isNumeric().withMessage("El id debe ser numérico"),
    body("cantidadBimestres")
        .notEmpty().withMessage("La cantidad de bimestres es obligatoria")
        .isNumeric().withMessage("La cantidad de bimestres debe ser numérica")
        .custom((value) => Number(value) <= 10).withMessage("La cantidad de bimestres no debe ser mayor a 10"),
    body("descripcion")
        .notEmpty().withMessage("La descripción es obligatoria")
        .isString().withMessage("La descripción debe ser un texto")
        .isLength({ max: 255 }).withMessage("La descripción debe tener máximo 255 caracteres"),
];