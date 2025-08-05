import { body } from 'express-validator';

export const tipoParentescoValidator = [
    body('descripcion')
        .isString().withMessage('La descripción debe ser un texto')
        .notEmpty().withMessage('La descripción es requerida')
        .isLength({ min: 2, max: 100 }).withMessage('La descripción debe tener entre 2 y 100 caracteres'),
];
