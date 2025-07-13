import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export const authWithRoles = (allowedRoles: number[]) => {
    return (req: Request, res: Response, next: NextFunction):any => {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Token no proporcionado' });
        }

        try {
            // 2. Verificar token
            const decoded = verifyToken(token);

            // Adjuntar usuario al request
            (req as any).usuario = decoded;


            const userRoleId = decoded.role;

            if (!allowedRoles.includes(userRoleId)) {
                return res.status(403).json({
                    message: 'No tienes permisos para esta acción',
                    requiredRoles: allowedRoles,
                    yourRole: userRoleId
                });
            }

            next();
        } catch (error) {
            return res.status(401).json({ message: 'Token inválido o expirado' });
        }
    };
};