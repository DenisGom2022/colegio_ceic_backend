import { body } from "express-validator";

export const catredraticoValidator = [
    body("dpi")
        .notEmpty()
        .withMessage("El dpi es obligatorio")
        .isNumeric()
        .withMessage("El dpi debe ser numérico"),
    body("idUsuario")
        .notEmpty()
        .withMessage("El id de usuario es obligatorio")
        .isString()
        .withMessage("El id de usuario debe ser una cadena de texto"),
];