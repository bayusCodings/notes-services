import Chance from 'chance';
import bcrypt from 'bcrypt';

import { UserRepository } from '../../repositories';
import { UserService } from '../../services';
import { UnauthorizedException, UnprocessableEntityException } from '../../exceptions';

const chance = new Chance();

describe('UserService', () => {
  afterEach(() => {
    jest.clearAllMocks()
  });

  const user: any = {
    firstName: chance.first(),
    lastName: chance.last(),
    email: chance.email(),
    password: chance.string(),
  };

  describe('#signup', () => {
    it('should successfully create new user account', async () => {
      const spyUserInsert = jest.spyOn(UserRepository, 'insert').mockResolvedValue(user);

      const result = await UserService.signup(user);
      expect(spyUserInsert).toHaveBeenCalled();
      expect(result.data).toEqual(user);
    });

    it('should throw unprocessable entity exception for duplicate email', async () => {
      const mongoDuplicateError = {
        name: 'MongoServerError',
        code: 11000
      };

      jest.spyOn(UserRepository, 'insert').mockRejectedValue(mongoDuplicateError);

      await expect(UserService.signup(user))
        .rejects.toThrow(UnprocessableEntityException);
    });
  });

  describe('#login', () => {
    it('should successfully authenticate the user', async () => {
      const spyUserFindOne = jest.spyOn(UserRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      const result = await UserService.login(user.email, user.password);
      expect(spyUserFindOne).toHaveBeenCalled();
      expect(result.data?.token).toBeDefined();
    });

    it('should throw unauthorized exception when email is incorrect', async () => {
      jest.spyOn(UserRepository, 'findOne').mockResolvedValue(null);

      await expect(UserService.login(user.email, user.password))
        .rejects.toThrow(UnauthorizedException);    
    });

    it('should throw unauthorized exception when password is incorrect', async () => {
      jest.spyOn(UserRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      await expect(UserService.login(user.email, user.password))
        .rejects.toThrow(UnauthorizedException);    
    });
  });
})