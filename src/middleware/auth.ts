import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../repositories';
import { JWT_KEY } from '../config'

import jwt from 'jsonwebtoken';

/**
 * Authenticate user access token
 */
export const userAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: 'Unauthorized access, no token provided' });
    }

    const token = req.headers.authorization.split(' ')[1];

    jwt.verify(token, JWT_KEY, async (err, decoded: any) => {
      if (err) {
        return res.status(401).json({ message: 'Failed to authenticate token' });
      }

      const user = await UserRepository.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'Invalid auth token' });
      }

      res.locals.user = user;
      next();
    });
  } catch(error) {
    next(error);
  }
}

export const checkUserPermission = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id } = res.locals.user;
    const { note } = res.locals;
  
    const idExist = note.userIds.some((objId: any) => objId.toString() === _id.toString());

    if (!idExist) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    next();
  } catch(error) {
    next(error);
  }
}
