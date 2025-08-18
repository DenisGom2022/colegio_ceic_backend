import { body } from "express-validator";

export const asignacionCatedraticoValidator = [
    body("idGradoCiclo")
        .notEmpty().withMessage("El idGradoCiclo es obligatorio")
        .isInt({ min: 1 }).withMessage("El idGradoCiclo debe ser un número entero positivo"),
    body("idCatedratico")
        .notEmpty().withMessage("El idCatedratico es obligatorio")
        .isInt({ min: 1 }).withMessage("El idCatedratico debe ser un número entero positivo"),
    body("idCurso")
        .notEmpty().withMessage("El idCurso es obligatorio")
        .isInt({ min: 1 }).withMessage("El idCurso debe ser un número entero positivo"),
    body("notaMaxima")
        .notEmpty().withMessage("La notaMaxima es obligatoria")
        .isInt({ min: 1 }).withMessage("La notaMaxima debe ser un número entero positivo"),
    body("notaAprobada")
        .notEmpty().withMessage("La notaAprobada es obligatoria")
        .isInt({ min: 1 }).withMessage("La notaAprobada debe ser un número entero positivo"),
    body("id")
        .optional()
        .isInt({ min: 1 }).withMessage("El id debe ser un número entero positivo"),
];

export const modificarAsignacionCatedraticoValidator = [
    body("idGradoCiclo")
        .notEmpty().withMessage("El idGradoCiclo es obligatorio")
        .isInt({ min: 1 }).withMessage("El idGradoCiclo debe ser un número entero positivo"),
    body("idCatedratico")
        .notEmpty().withMessage("El idCatedratico es obligatorio")
        .isInt({ min: 1 }).withMessage("El idCatedratico debe ser un número entero positivo"),
    body("idCurso")
        .notEmpty().withMessage("El idCurso es obligatorio")
        .isInt({ min: 1 }).withMessage("El idCurso debe ser un número entero positivo"),
    body("notaMaxima")
        .notEmpty().withMessage("La notaMaxima es obligatoria")
        .isInt({ min: 1 }).withMessage("La notaMaxima debe ser un número entero positivo"),
    body("notaAprobada")
        .notEmpty().withMessage("La notaAprobada es obligatoria")
        .isInt({ min: 1 }).withMessage("La notaAprobada debe ser un número entero positivo"),
    body("id")
        .notEmpty().withMessage("El id es obligatorio")
        .isInt({ min: 1 }).withMessage("El id debe ser un número entero positivo"),
];