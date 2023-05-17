import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';
import { handleValidationError } from './validation.error';
import { NotFoundException, UnprocessableEntityException } from '../exceptions';
import { NoteRepository } from '../repositories';

import Joi from 'joi';

class NoteValidation {
  validateNoteCreation(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      title: Joi.string().required(),
      content: Joi.string().allow('').optional(),
    });
    
    const validationResult = schema.validate(req.body, {allowUnknown: false});
    return handleValidationError(validationResult, next)
  };

  validateNoteShare(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
      email: Joi.string().email(),
    });
    
    const validationResult = schema.validate(req.body, {allowUnknown: false});
    return handleValidationError(validationResult, next)
  };
  
  async validateNoteId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        throw new UnprocessableEntityException(`Invalid ObjectId: ${id}`);
      }

      const note = await NoteRepository.findById(id);
      if (!note) {
        throw new NotFoundException(`Note with id: ${id} does not exist`);
      }

      res.locals.note = note;
      next();
    } catch(error) {
      next(error);
    }
  }
}

export default new NoteValidation();
