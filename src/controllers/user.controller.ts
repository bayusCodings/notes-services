import { Request, Response } from 'express';
import { UserService } from '../services';
import { CreateUserRequest } from '../interfaces/user.interface';

class UserController {
  async signup(req: Request, res: Response) {
    const { firstName, lastName, email, password } = req.body;

    const request: CreateUserRequest = {
      firstName, lastName, email, password
    }
    const response = await UserService.signup(request);
    return res.status(201).json(response);
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    
    const response = await UserService.login(email, password);
    return res.status(200).json(response);
  }
}

export default new UserController();