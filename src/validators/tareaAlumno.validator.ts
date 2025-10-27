import { body } from 'express-validator';

export const tareaAlumnoValidator = [
  body('idTarea')
    .exists().withMessage('idTarea es requerido')
    .isInt({ min: 1 }).withMessage('idTarea debe ser un número entero positivo'),
  body('idAsignacionAlumno')
    .exists().withMessage('idAsignacionAlumno es requerido')
    .isInt({ min: 1 }).withMessage('idAsignacionAlumno debe ser un número entero positivo'),
  body('fechaEntrega')
    .exists().withMessage('fechaEntrega es requerida')
  .isISO8601().withMessage('fechaEntrega debe ser una fecha válida (ISO8601), por ejemplo: 2025-10-22T15:30:00Z'),
  body('puntoObtenido')
    .exists().withMessage('puntoObtenido es requerido')
    .isFloat({ min: 0 }).withMessage('puntoObtenido debe ser un número positivo'),
];

export const tareaAlumnoCambiaPunteoValidator = [
  body('nuevoPunteo')
    .exists().withMessage('nuevoPunteo es requerido')
    .isFloat({ min: 0 }).withMessage('nuevoPunteo debe ser un número positivo'),
];
