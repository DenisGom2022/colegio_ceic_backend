import { body, param } from 'express-validator';

export const asignacionAlumnoValidator = [
  body('cuiAlumno')
    .exists().withMessage('El campo cuiAlumno es requerido')
    .isString().withMessage('El campo cuiAlumno debe ser una cadena')
    .notEmpty().withMessage('El campo cuiAlumno no puede estar vacío'),
  body('idGrado')
    .exists().withMessage('El campo idGrado es requerido')
    .isInt({ min: 1 }).withMessage('El campo idGrado debe ser un número entero positivo')
];

export const updateAsignacionValidator = [
  param('id')
    .exists().withMessage('El parámetro id es requerido')
    .isInt({ min: 1 }).withMessage('El parámetro id debe ser un número entero positivo'),
  body('idGrado')
    .exists().withMessage('El campo idGrado es requerido')
    .isInt({ min: 1 }).withMessage('El campo idGrado debe ser un número entero positivo')
];
