import express, { Router } from 'express';
import { UserController } from '../controllers';
import { UserValidation } from '../validations';
import { AsyncError } from '../errorhandlers';

const router: Router = express.Router();

router.post('/auth/signup',
  UserValidation.validateUserCreation,
  AsyncError(UserController.signup)
);

router.post('/auth/login',
  UserValidation.validateUserLogin, 
  AsyncError(UserController.login)
);

export default router
