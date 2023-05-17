import Chance from 'chance';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';

import { NoteRepository, UserRepository } from '../../repositories';

const chance = new Chance();

describe('NoteController', () => {
  afterEach(() => {
    jest.clearAllMocks()
  });

  const token = chance.string();
  const userId = chance.guid();
  const user: any = {
    _id: userId,
    firstName: chance.first(),
    lastName: chance.last(),
    email: chance.email(),
    password: chance.string(),
  };

  const note: any = {
    _id: chance.guid(),
    userIds: [userId],
    title: chance.string(),
    content: chance.paragraph(),
  };

  jest.spyOn(jwt, 'verify').mockImplementation((_token, key, callback: any) => {
    if (_token === token) {
      const decoded = { id: chance.string() };
      callback(null, decoded);
    } else {
      const err = new Error('Failed to authenticate token');
      callback(err);
    }
  });

  describe('POST /api/notes', () => {
    const requestBody = {
      title: note.title,
      content: note.content
    };

    it('should successfully create user note', async () => {
      jest.spyOn(UserRepository, 'findById').mockResolvedValue(user);
      jest.spyOn(NoteRepository, 'insert').mockResolvedValue(note);

      const response = await request(app)
        .post('/api/notes')
        .send(requestBody)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.title).toBe(note.title);
      expect(response.body.data.content).toBe(note.content);
    });

    it('should validate request body', async () => {
      jest.spyOn(UserRepository, 'findById').mockResolvedValue(user);
      const requestBody = {}; // empty request body

      const response = await request(app)
        .post('/api/notes')
        .send(requestBody)
        .set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(400);
    });

    it('should throw unauthorized error if token is not passed', async () => {
        const response = await request(app)
        .post('/api/notes').send(requestBody);
  
      expect(response.status).toBe(401);
    });

    it('should throw unauthorized error when an invalid token is provided', async () => {
      const invalidToken = chance.string();
      const response = await request(app)
        .post('/api/notes')
        .send(requestBody)
        .set('Authorization', `Bearer ${invalidToken}`);
  
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/notes', () => {
    it('should successfully fetch all user notes', async () => {
      jest.spyOn(UserRepository, 'findById').mockResolvedValue(user);
      jest.spyOn(NoteRepository, 'find').mockResolvedValue([note]);

      const response = await request(app)
        .get('/api/notes')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toEqual([note]);
    });

    it('should throw unauthorized error if token is not passed', async () => {
      const response = await request(app)
        .get('/api/notes');
  
      expect(response.status).toBe(401);
    });

    it('should throw unauthorized error when an invalid token is provided', async () => {
        const invalidToken = chance.string();
        const response = await request(app)
          .get('/api/notes')
          .set('Authorization', `Bearer ${invalidToken}`);
  
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/note/:id', () => {
    const id = new mongoose.Types.ObjectId();

    it('should successfully fetch user note', async () => {
      jest.spyOn(UserRepository, 'findById').mockResolvedValue(user);
      jest.spyOn(NoteRepository, 'findById').mockResolvedValue(note);

      const response = await request(app)
        .get(`/api/notes/${id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toEqual(note);
    });

    it('should throw unauthorized error if token is not passed', async () => {
      const response = await request(app)
        .get(`/api/notes/${id}`)
  
      expect(response.status).toBe(401);
    });

    it('should throw unauthorized error when an invalid token is provided', async () => {
        const invalidToken = chance.string();
        const response = await request(app)
          .get('/api/notes')
          .set('Authorization', `Bearer ${invalidToken}`);
  
      expect(response.status).toBe(401);
    });

    it('should throw forbidden error if user is not permitted to perform action', async () => {
      const differentUser = {
        ...user, _id: chance.guid()
      }
      jest.spyOn(NoteRepository, 'findById').mockResolvedValue(note);
      jest.spyOn(UserRepository, 'findById').mockResolvedValue(differentUser);

      const response = await request(app)
        .get(`/api/notes/${id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });
  });

  describe('PUT /api/notes/:id', () => {
    const id = new mongoose.Types.ObjectId();
    const requestBody = {
      title: note.title,
      content: note.content
    };

    it('should successfully update user note', async () => {
      jest.spyOn(UserRepository, 'findById').mockResolvedValue(user);
      jest.spyOn(NoteRepository, 'findById').mockResolvedValue(note);
      jest.spyOn(NoteRepository, 'update').mockResolvedValue(note);

      const response = await request(app)
        .put(`/api/notes/${id}`)
        .send(requestBody)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should throw unauthorized error if token is not passed', async () => {
        const response = await request(app)
          .put(`/api/notes/${id}`)
          .send(requestBody);
  
      expect(response.status).toBe(401);
    });

    it('should throw unauthorized error when an invalid token is provided', async () => {
        const invalidToken = chance.string();
        const response = await request(app)
          .put(`/api/notes/${id}`)
          .send(requestBody)
          .set('Authorization', `Bearer ${invalidToken}`);
  
      expect(response.status).toBe(401);
    });

    it('should throw forbidden error if user is not permitted to perform action', async () => {
      const differentUser = {
        ...user, _id: chance.guid()
      }
      jest.spyOn(NoteRepository, 'findById').mockResolvedValue(note);
      jest.spyOn(UserRepository, 'findById').mockResolvedValue(differentUser);

      const response = await request(app)
        .put(`/api/notes/${id}`)
        .send(requestBody)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/notes/:id/share', () => {
    const id = new mongoose.Types.ObjectId();

    const requestBody = {
      email: chance.email(),
    };

    it('should successfully share user note', async () => {
      jest.spyOn(UserRepository, 'findById').mockResolvedValue(user);
      jest.spyOn(NoteRepository, 'findById').mockResolvedValue(note);
      jest.spyOn(UserRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(NoteRepository, 'update').mockResolvedValue(note);

      const response = await request(app)
        .post(`/api/notes/${id}/share`)
        .send(requestBody)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should throw unauthorized error if token is not passed', async () => {
      const response = await request(app)
        .post(`/api/notes/${id}/share`)
        .send(requestBody);
  
      expect(response.status).toBe(401);
    });

    it('should throw unauthorized error when an invalid token is provided', async () => {
        const invalidToken = chance.string();
        const response = await request(app)
          .post(`/api/notes/${id}/share`)
          .send(requestBody)
          .set('Authorization', `Bearer ${invalidToken}`);
  
      expect(response.status).toBe(401);
    });

    it('should throw forbidden error if user is not permitted to perform action', async () => {
      const differentUser = {
        ...user, _id: chance.guid()
      }
      jest.spyOn(NoteRepository, 'findById').mockResolvedValue(note);
      jest.spyOn(UserRepository, 'findById').mockResolvedValue(differentUser);

      const response = await request(app)
        .post(`/api/notes/${id}/share`)
        .send(requestBody)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/notes/:id', () => {
    const id = new mongoose.Types.ObjectId();

    it('should successfully delete user note', async () => {
      jest.spyOn(UserRepository, 'findById').mockResolvedValue(user);
      jest.spyOn(NoteRepository, 'findById').mockResolvedValue(note);
      jest.spyOn(NoteRepository, 'deleteById').mockResolvedValue(<any>{ rows: 1 });

      const response = await request(app)
        .delete(`/api/notes/${id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should throw unauthorized error if token is not passed', async () => {
      const response = await request(app)
        .delete(`/api/notes/${id}`)
  
      expect(response.status).toBe(401);
    });

    it('should throw unauthorized error when an invalid token is provided', async () => {
        const invalidToken = chance.string();
        const response = await request(app)
          .delete(`/api/notes/${id}`)
          .set('Authorization', `Bearer ${invalidToken}`);
  
      expect(response.status).toBe(401);
    });

    it('should throw forbidden error if user is not permitted to perform action', async () => {
      const differentUser = {
        ...user, _id: chance.guid()
      }
      jest.spyOn(NoteRepository, 'findById').mockResolvedValue(note);
      jest.spyOn(UserRepository, 'findById').mockResolvedValue(differentUser);

      const response = await request(app)
        .delete(`/api/notes/${id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/search', () => {
    const keyword = chance.string();

    it('should successfully search user notes', async () => {
      jest.spyOn(UserRepository, 'findById').mockResolvedValue(user);
      jest.spyOn(NoteRepository, 'find').mockResolvedValue([note]);

      const response = await request(app)
        .get(`/api/search?q=${keyword}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toEqual([note]);
    });

    it('should throw unauthorized error if token is not passed', async () => {
      const response = await request(app)
        .get(`/api/search?q=${keyword}`)
  
      expect(response.status).toBe(401);
    });

    it('should throw unauthorized error when an invalid token is provided', async () => {
        const invalidToken = chance.string();
        const response = await request(app)
          .get(`/api/search?q=${keyword}`)
          .set('Authorization', `Bearer ${invalidToken}`);
  
      expect(response.status).toBe(401);
    });
  });
});
