import { body } from "express-validator";

export const loginValidator = [
    body("username")
        .notEmpty()
        .withMessage("El nombre de usuario es obligatorio")
        .isString()
        .withMessage("El nombre de usuario debe ser una cadena de texto"),
    body("password")
        .notEmpty()
        .withMessage("La contraseña es obligatoria")
        .isString()
        .withMessage("La contraseña debe ser una cadena de texto"),
];