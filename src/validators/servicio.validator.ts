import { body } from 'express-validator';

export const servicioValidator = [
    body('descripcion')
        .exists().withMessage('La descripción es obligatoria')
        .isString().withMessage('La descripción debe ser un string')
        .notEmpty().withMessage('La descripción no puede estar vacía')
        .isLength({ min: 1, max: 100 }).withMessage('La descripción debe tener entre 1 y 100 caracteres'),
    
    body('valor')
        .exists().withMessage('El valor es obligatorio')
        .isFloat({ min: 0.01 }).withMessage('El valor debe ser un número decimal positivo mayor a 0')
        .custom((value) => {
            // Verificar que no tenga más de 2 decimales
            const regex = /^\d+(\.\d{1,2})?$/;
            if (!regex.test(value.toString())) {
                throw new Error('El valor no puede tener más de 2 decimales');
            }
            return true;
        }),
    
    body('fecha_a_pagar')
        .exists().withMessage('La fecha a pagar es obligatoria')
        .isISO8601().withMessage('La fecha a pagar debe tener formato de fecha válido (ISO 8601)')
        .custom((value) => {
            const fechaPago = new Date(value);
            const fechaActual = new Date();
            fechaActual.setHours(0, 0, 0, 0); // Establecer a medianoche para comparar solo fechas
            
            if (fechaPago < fechaActual) {
                throw new Error('La fecha a pagar no puede ser anterior a la fecha actual');
            }
            return true;
        }),
    
    body('id_grado_ciclo')
        .exists().withMessage('El id del grado ciclo es obligatorio')
        .isInt({ min: 1 }).withMessage('El id del grado ciclo debe ser un número entero positivo')
];

export const servicioUpdateValidator = [
    body('descripcion')
        .optional()
        .isString().withMessage('La descripción debe ser un string')
        .notEmpty().withMessage('La descripción no puede estar vacía')
        .isLength({ min: 1, max: 100 }).withMessage('La descripción debe tener entre 1 y 100 caracteres'),
    
    body('valor')
        .optional()
        .isFloat({ min: 0.01 }).withMessage('El valor debe ser un número decimal positivo mayor a 0')
        .custom((value) => {
            if (value !== undefined) {
                // Verificar que no tenga más de 2 decimales
                const regex = /^\d+(\.\d{1,2})?$/;
                if (!regex.test(value.toString())) {
                    throw new Error('El valor no puede tener más de 2 decimales');
                }
            }
            return true;
        }),
    
    body('fecha_a_pagar')
        .optional()
        .isISO8601().withMessage('La fecha a pagar debe tener formato de fecha válido (ISO 8601)')
        .custom((value) => {
            if (value !== undefined) {
                const fechaPago = new Date(value);
                const fechaActual = new Date();
                fechaActual.setHours(0, 0, 0, 0); // Establecer a medianoche para comparar solo fechas
                
                if (fechaPago < fechaActual) {
                    throw new Error('La fecha a pagar no puede ser anterior a la fecha actual');
                }
            }
            return true;
        }),
    
    body('id_grado_ciclo')
        .optional()
        .isInt({ min: 1 }).withMessage('El id del grado ciclo debe ser un número entero positivo')
];