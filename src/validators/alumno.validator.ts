import { body } from 'express-validator';

export const alumnoValidator = [
    body('cui')
        .isString().withMessage('CUI debe ser un string')
        .isLength({ min: 13, max: 13 }).withMessage('CUI debe tener 13 caracteres'),
    body('primerNombre')
        .isString().withMessage('primerNombre debe ser un string')
        .notEmpty().withMessage('primerNombre es requerido'),
    body('segundoNombre')
        .optional()
        .isString().withMessage('segundoNombre debe ser un string'),
    body('tercerNombre')
        .optional()
        .isString().withMessage('tercerNombre debe ser un string'),
    body('primerApellido')
        .isString().withMessage('primerApellido debe ser un string')
        .notEmpty().withMessage('primerApellido es requerido'),
    body('segundoApellido')
        .isString().withMessage('segundoApellido debe ser un string')
        .notEmpty().withMessage('segundoApellido es requerido'),
    body('telefono')
        .isString().withMessage('telefono debe ser un string')
        .isLength({ min: 8, max: 8 }).withMessage('telefono debe tener 8 dígitos'),
    body('genero')
        .isIn(['M', 'F']).withMessage('genero debe ser "M" o "F"'),
    body('responsables')
        .isArray().withMessage('responsables debe ser un arreglo'),
    body('responsables').custom((value) => {
        if (!Array.isArray(value)) return false;
        // Permitir arreglo vacío
        return true;
    }).withMessage('responsables debe ser un arreglo'),
    body('responsables.*.idResponsable')
        .if(body('responsables').isArray({ min: 1 }))
        .isInt({ min: 1 }).withMessage('idResponsable debe ser un entero positivo'),
    body('responsables.*.primerNombre')
        .if(body('responsables').isArray({ min: 1 }))
        .isString().withMessage('primerNombre del responsable debe ser un string')
        .notEmpty().withMessage('primerNombre del responsable es requerido'),
    body('responsables.*.segundoNombre')
        .optional()
        .isString().withMessage('segundoNombre del responsable debe ser un string'),
    body('responsables.*.tercerNombre')
        .optional()
        .isString().withMessage('tercerNombre del responsable debe ser un string'),
    body('responsables.*.primerApellido')
        .if(body('responsables').isArray({ min: 1 }))
        .isString().withMessage('primerApellido del responsable debe ser un string')
        .notEmpty().withMessage('primerApellido del responsable es requerido'),
    body('responsables.*.segundoApellido')
        .if(body('responsables').isArray({ min: 1 }))
        .isString().withMessage('segundoApellido del responsable debe ser un string')
        .notEmpty().withMessage('segundoApellido del responsable es requerido'),
    body('responsables.*.telefono')
        .if(body('responsables').isArray({ min: 1 }))
        .isString().withMessage('telefono del responsable debe ser un string')
        .isLength({ min: 8, max: 8 }).withMessage('telefono del responsable debe tener 8 dígitos'),
    body('responsables.*.idParentesco')
        .if(body('responsables').isArray({ min: 1 }))
        .isInt({ min: 1 }).withMessage('idParentesco debe ser un entero positivo'),
];