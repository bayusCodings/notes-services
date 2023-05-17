import { User } from '../models';
import { IUser } from '../interfaces/user.interface';

import MongoRepository from './mongo.repository';

class UserRepository extends MongoRepository<IUser> {
  constructor() {
    super(User);
  }
}

export default new UserRepository();
