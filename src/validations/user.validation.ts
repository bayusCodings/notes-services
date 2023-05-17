import { Request, Response, NextFunction } from 'express';
import { handleValidationError } from './validation.error';

import Joi from 'joi';

class UserValidation {
  validateUserCreation(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email(),
      password: Joi.string().required(),
    });
    
    const validationResult = schema.validate(req.body, {allowUnknown: false});
    return handleValidationError(validationResult, next)
  };

  validateUserLogin(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      email: Joi.string().email(),
      password: Joi.string().required(),
    });
    
    const validationResult = schema.validate(req.body, {allowUnknown: false});
    return handleValidationError(validationResult, next)
  };
}

export default new UserValidation();
