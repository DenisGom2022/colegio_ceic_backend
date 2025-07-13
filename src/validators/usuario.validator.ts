import { body } from 'express-validator';

export const usuarioValidator = [
    body('usuario')
        .isString().withMessage('El usuario debe ser una cadena de texto')
        .notEmpty().withMessage('El usuario es requerido'),
    body('contrasena')
        .isString().withMessage('La contraseña debe ser una cadena de texto')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('primerNombre')
        .isString().withMessage('El primer nombre debe ser una cadena de texto')
        .notEmpty().withMessage('El primer nombre es requerido'),
    body('segundoNombre')
        .optional()
        .isString().withMessage('El segundo nombre debe ser una cadena de texto'),
    body('tercerNombre')
        .optional()
        .isString().withMessage('El tercer nombre debe ser una cadena de texto'),
    body('primerApellido')
        .isString().withMessage('El primer apellido debe ser una cadena de texto')
        .notEmpty().withMessage('El primer apellido es requerido'),
    body('segundoApellido')
        .optional()
        .isString().withMessage('El segundo apellido debe ser una cadena de texto'),
    body('telefono')
        .isString().withMessage('El teléfono debe ser una cadena de texto')
        .notEmpty().withMessage('El teléfono es requerido'),
    body('idTipoUsuario')
        .isNumeric().withMessage('El tipo de usuario debe ser numérico')
        .notEmpty().withMessage('El tipo de usuario es requerido'),
];