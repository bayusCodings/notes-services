import { NextFunction } from 'express';
import { ValidationResult } from 'joi';
import { BadRequestException } from '../exceptions';
import logger from '../logger';

export const handleValidationError = (validationResult: ValidationResult, next: NextFunction) => {
  if (validationResult.error) {
    const message = validationResult.error.details[0].message;
    logger.error('Validation error: %s', message)
    throw new BadRequestException(message);
  }
  return next();
};
