
import { body } from 'express-validator';

export const tareaValidator = [
    body('titulo')
        .notEmpty().withMessage('El título es obligatorio')
        .isString().withMessage('El título debe ser un texto'),
    body('descripcion')
        .notEmpty().withMessage('La descripción es obligatoria')
        .isString().withMessage('La descripción debe ser un texto'),
    body('punteo')
        .notEmpty().withMessage('El punteo es obligatorio')
        .isNumeric().withMessage('El punteo debe ser un número')
        .custom((value) => value > 0).withMessage('El punteo debe ser mayor a cero'),
    body('fechaEntrega')
        .notEmpty().withMessage('La fecha de entrega es obligatoria')
        .isISO8601().withMessage('La fecha de entrega debe tener formato válido (ejemplo: 2025-08-28T15:30:00Z)'),
    body('idCurso')
        .notEmpty().withMessage('El idCurso es obligatorio')
        .isInt().withMessage('El idCurso debe ser un número entero'),
    body('nroBimestre')
        .notEmpty().withMessage('El nroBimestre es obligatorio')
        .isInt().withMessage('El nroBimestre debe ser un número entero'),
];
