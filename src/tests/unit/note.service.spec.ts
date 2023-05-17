import Chance from 'chance';

import { NoteRepository, UserRepository } from '../../repositories';
import { NoteService } from '../../services';
import { InternalServerException, NotFoundException } from '../../exceptions';

const chance = new Chance();

describe('NoteService', () => {
  afterEach(() => {
    jest.clearAllMocks()
  });

  const user: any = {
    firstName: chance.first(),
    lastName: chance.last(),
    email: chance.email(),
    password: chance.string(),
  };

  const note: any = {
    userIds: [chance.guid()],
    title: chance.string(),
    content: chance.paragraph(),
  };

  const mongoNetworkTimeoutError = {
    name: 'MongoServerError',
    code: 89 
  };

  describe('#create', () => {
    const createNote: any = {
      userId: note.userIds[0],
      title: note.title,
      content: note.content,
    };

    it('should successfully create new note', async () => {
      const spyNoteInsert = jest.spyOn(NoteRepository, 'insert').mockResolvedValue(note);

      const result = await NoteService.create(createNote);
      expect(spyNoteInsert).toHaveBeenCalled();
      expect(result.data).toEqual(note);
    });

    it('should throw an internal server exception if an error occured during insertion', async () => {
      jest.spyOn(NoteRepository, 'insert').mockImplementation(() => Promise.reject(mongoNetworkTimeoutError));
      await expect(NoteService.create(createNote)).rejects.toThrow(InternalServerException);    
    });
  });

  describe('#fetchNotes', () => {
    const userId = chance.guid();

    it('should successfully fetch all user note', async () => {
      const spyNoteFind = jest.spyOn(NoteRepository, 'find').mockResolvedValue([note]);

      const result = await NoteService.fetchNotes(userId);
      expect(spyNoteFind).toHaveBeenCalled();
      expect(result.data).toEqual([note]);
    });

    it('should return an empty list if user has no note', async () => {
      const spyNoteFind = jest.spyOn(NoteRepository, 'find').mockResolvedValue([]);

      const result = await NoteService.fetchNotes(userId);
      expect(spyNoteFind).toHaveBeenCalled();
      expect(result.data).toEqual([]);
    });
  });

  describe('#update', () => {
    const noteId = chance.guid();
    const updates = {
      title: note.title,
      content: note.content,
    };

    it('should successfully update user note', async () => {
      const spyNoteUpdate = jest.spyOn(NoteRepository, 'update').mockResolvedValue(note);

      const result = await NoteService.update(noteId, updates);
      expect(spyNoteUpdate).toHaveBeenCalled();
      expect(result.data).toEqual(note);
    });

    it('should throw an internal server exception if an error occured during update', async () => {
      jest.spyOn(NoteRepository, 'update').mockRejectedValue(mongoNetworkTimeoutError);
      await expect(NoteService.update(noteId, updates)).rejects.toThrow(InternalServerException);
    });
  });

  describe('#share', () => {
    const noteId = chance.guid();
    const email = user.email

    it('should successfully share user note', async () => {
      const spyUserFindOne = jest.spyOn(UserRepository, 'findOne').mockResolvedValue(user);
      const spyNoteUpdate = jest.spyOn(NoteRepository, 'update').mockResolvedValue(note);

      const result = await NoteService.share(noteId, email);
      expect(spyUserFindOne).toHaveBeenCalled();
      expect(spyNoteUpdate).toHaveBeenCalled();
      expect(result.message).toEqual('Successfully shared user note');
    });

    it('should throw not found exception if provided email does not exist', async () => {
      jest.spyOn(UserRepository, 'findOne').mockResolvedValue(null);
      await expect(NoteService.share(noteId, email)).rejects.toThrow(NotFoundException);    
    });
  });

  describe('#delete', () => {
    const noteId = chance.guid();

    it('should successfully delete user note', async () => {
      const spyNoteDelete = jest.spyOn(NoteRepository, 'deleteById').mockResolvedValue(<any>{ rows: 1 });

      const result = await NoteService.delete(noteId);
      expect(spyNoteDelete).toHaveBeenCalled();
      expect(result.message).toEqual('Successfully deleted user note');
    });
  });

  describe('#search', () => {
    const userId = chance.guid();
    const keyword = chance.string();

    it('should successfully search user notes', async () => {
      const spyNoteFind = jest.spyOn(NoteRepository, 'find').mockResolvedValue([note]);

      const result = await NoteService.search(userId, keyword);
      expect(spyNoteFind).toHaveBeenCalled();
      expect(result.data).toEqual([note]);
    });

    it('should return an empty list if keyword matches no note', async () => {
      const spyNoteFind = jest.spyOn(NoteRepository, 'find').mockResolvedValue([]);

      const result = await NoteService.search(userId, keyword);
      expect(spyNoteFind).toHaveBeenCalled();
      expect(result.data).toEqual([]);
    });
  });
})