/**
 * Middleware de Tratamento de Erros
 * 
 * Implementar:
 * 1. Tratamento de erros globais
 * 2. Formatação padronizada de respostas de erro
 * 3. Tratamento específico para:
 *    - Erros de validação
 *    - Erros de banco de dados
 *    - Erros de negócio
 */

import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { GeoValidationError, PartnerNotFoundError, ValidationError } from '../utils/errors';

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(`Error: ${err.message}`);
  console.error(err.stack);

  if (err instanceof ValidationError || err instanceof GeoValidationError) {
    res.status(400).json({
      status: 'error',
      message: err.message,
      type: err.constructor.name
    });
    return;
  }

  if (err instanceof PartnerNotFoundError) {
    res.status(404).json({
      status: 'error',
      message: err.message,
      type: 'PartnerNotFoundError'
    });
    return;
  }

  // MongoDB errors
  if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    if ((err as any).code === 11000) {
      res.status(409).json({
        status: 'error',
        message: 'Duplicate key error',
        type: 'MongoError'
      });
      return;
    }
  }

  // Default error
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    type: 'ServerError'
  });
};