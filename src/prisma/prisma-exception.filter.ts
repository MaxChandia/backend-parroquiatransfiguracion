import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Response } from "express";

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter{
    catch(error: PrismaClientKnownRequestError, host: ArgumentsHost){
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
    
    switch (error.code) {
        case 'P2002':
            return response.status(409).json({message: 'Registro Duplicado'})
        case 'P2025': 
            return response.status(404).json({message: 'Registro no encontrado'})
        default:
            return response.status(500).json({message: 'No se pudo conectar con el servidor'})
    }

    }
}