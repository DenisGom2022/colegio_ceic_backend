import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator"

export const validarDatos = (req:Request, res:Response, next:NextFunction):any => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({
            message: result.array()[0].msg,
        });
    } 

    next();
}