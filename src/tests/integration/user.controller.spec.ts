import Chance from 'chance';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '../../app';

import { UserRepository } from '../../repositories';

const chance = new Chance();

describe('UserController', () => {
  afterEach(() => {
    jest.clearAllMocks()
  });

  const user: any = {
    firstName: chance.first(),
    lastName: chance.last(),
    email: chance.email(),
    password: chance.string(),
  };

  describe('POST /api/auth/signup', () => {
    it('should successfully create new user account', async () => {
      jest.spyOn(UserRepository, 'insert').mockResolvedValue(user);
      
      const response = await request(app)
        .post('/api/auth/signup').send(user);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.firstName).toBe(user.firstName);
      expect(response.body.data.lastName).toBe(user.lastName);
      expect(response.body.data.email).toBe(user.email);
    });

    it('should validate request body', async () => {
        const requestBody = {
            ...user, firstName: undefined
        };

        const response = await request(app)
          .post('/api/auth/signup').send(requestBody);
  
        expect(response.status).toBe(400);
      });
  });

  describe('POST /api/auth/login', () => {
    const requestBody = {
      email: user.email,
      password: user.password,
    };

    it('should successfully authenticate user', async () => {
      jest.spyOn(UserRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
      jest.spyOn(jwt, 'sign').mockImplementation(() => chance.string());
      
      const response = await request(app)
        .post('/api/auth/login').send(requestBody);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.token).toBeDefined();
    });

    it('should validate request body', async () => {
        const requestBody = {}; // empty request body

        const response = await request(app)
          .post('/api/auth/login').send(requestBody);
  
        expect(response.status).toBe(400);
    });

    it('should throw unauthorized error for incorrect login credentials', async () => {
      jest.spyOn(UserRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));
        
      const response = await request(app)
        .post('/api/auth/login').send(requestBody);
  
      expect(response.status).toBe(401);
    });
  });
});
