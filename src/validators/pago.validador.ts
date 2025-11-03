import { body, query } from "express-validator";

export const pagoValidator = [
    body("idAsignacionCurso")
        .exists().withMessage("El idAsignacionCurso es obligatorio")
        .isInt({ min: 1 }).withMessage("El idAsignacionCurso debe ser un número entero positivo"),
    body("tipoPagoId")
        .exists().withMessage("El tipoPagoId es obligatorio")
        .isInt({ min: 1 }).withMessage("El tipoPagoId debe ser un número entero positivo"),
    body("numeroPago")
        .exists().withMessage("El numeroPago es obligatorio")
        .isInt({ min: 1 }).withMessage("El numeroPago debe ser un número entero positivo"),
    body("valor")
        .exists().withMessage("El valor es obligatorio")
        .isFloat({ min: 0 }).withMessage("El valor debe ser un número decimal positivo"),
    body("mora")
        .exists().withMessage("La mora es obligatoria")
        .isFloat({ min: 0 }).withMessage("La mora debe ser un número decimal positivo"),
    body("fechaPago")
        .exists().withMessage("La fechaPago es obligatoria")
        .isISO8601().withMessage("La fechaPago debe tener formato de fecha válido (ISO 8601)")
];

export const getPagosValidator = [
    query("page")
        .optional()
        .isInt({ min: 1 }).withMessage("El parámetro 'page' debe ser un número entero positivo"),
    query("limit")
        .optional()
        .isInt({ min: 1 }).withMessage("El parámetro 'limit' debe ser un número entero positivo"),
    query("cui")
        .optional()
        .isString().withMessage("El parámetro 'cui' debe ser una cadena de texto"),
    query("fechaInicio")
        .optional()
        .isISO8601().withMessage("El parámetro 'fechaInicio' debe ser una fecha válida (ISO 8601)"),
    query("fechaFin")
        .optional()
        .isISO8601().withMessage("El parámetro 'fechaFin' debe ser una fecha válida (ISO 8601)")
];