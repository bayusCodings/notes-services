import { JWT_KEY } from '../config'
import { UserRepository } from '../repositories';
import { IUser, CreateUserRequest } from '../interfaces/user.interface';
import { asApiResponse } from '../types/response.dto';
import { 
  InternalServerException,
  UnprocessableEntityException,
  UnauthorizedException
} from '../exceptions';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from '../logger';
import ApplicationError from '../exceptions/application.error';

class UserService {
  /**
   * Creates a new user account
   */
  async signup(request: CreateUserRequest) {
    logger.debug('UserService.create(%o)', request);
    try {
      const data: IUser = {
        ...request,
        email: request.email.toLowerCase(),
      }

      const user = await UserRepository.insert(data);
      return asApiResponse(user, 'Successfully created new user');
    } catch(error: any) {
      if (error.name === 'MongoServerError' && error.code === 11000) {
        // Duplicate email
        logger.error('Failed to create new user, duplicate email: %s', request.email);
        throw new UnprocessableEntityException('Failed to create new user, duplicate email');
      }

      logger.error('Failed to create new user. %o', error);
      throw new InternalServerException('An error occured while creating new user');
    }
  }

  /**
   * Authenticate user
   */
  async login(email: string, password: string) {
    logger.debug('UserService.login(%s, %s)', email, password);
    try {
      const user = await UserRepository.findOne({ email });
      if (!user) {
        throw new UnauthorizedException('Incorrect user email');
      }

      const pass = await bcrypt.compare(password, user.password);
      if (!pass) {
        throw new UnauthorizedException('Incorrect password');
      }

      const payload = { id: user._id };
      const token = jwt.sign(payload, JWT_KEY, { expiresIn: '24h' });

      return asApiResponse({ token }, 'User logged in Successfully')
    } catch (error: any) {
      if (error instanceof ApplicationError) {
        throw error;
      }

      logger.error('Failed to authenticate user. %o', error);
      throw new InternalServerException('An error occured while creating new user');
    }
  }
}

export default new UserService();
