import { NoteRepository, UserRepository } from '../repositories';
import { CreateNoteRequest, INote, UpdateNoteRequest } from '../interfaces/note.interface';
import { asApiResponse } from '../types/response.dto';
import { InternalServerException, NotFoundException } from '../exceptions';

import logger from '../logger';
import ApplicationError from '../exceptions/application.error';

class NoteService {
  /**
   * Creates a new note
   */
  async create(request: CreateNoteRequest) {
    logger.debug('NoteService.create(%o)', request);
    try {
      const data: INote = {
        userIds: [request.userId],
        title: request.title,
        content: request.content
      }

      const note = await NoteRepository.insert(data);
      return asApiResponse(note, 'Successfully created new note');
    } catch(error: any) {
      logger.error('Failed to create new note. %o', error);
      throw new InternalServerException('An error occured while creating new note');
    }
  }

  /**
   * Fetch all user notes
   */
  async fetchNotes(userId: string) {
    logger.debug('NoteService.fetchNotes(%s)', userId);
    try {
      const notes = await NoteRepository.find({ userIds: userId });
      return asApiResponse(notes, 'Successfully retrieved all user notes');
    } catch(error: any) {
      logger.error('Failed to retrieve all user notes. %o', error);
      throw new InternalServerException('An error occured while retrieving all user notes');
    }
  }

  /**
   * Updates a user note
   */
  async update(noteId: string, updates: UpdateNoteRequest) {
    logger.debug('NoteService.update(%s, %o)', noteId, updates);
    try {
      const note = await NoteRepository.update(noteId, updates);
      return asApiResponse(note, 'Successfully updated user note');
    } catch(error: any) {
      logger.error('Failed to update user note. %o', error);
      throw new InternalServerException('An error occured while updating user note');
    }
  }

  /**
   * Share user note
   * @param noteId id of note to be shared.
   * @param email email address of the user the note is being shared with.
   */
  async share(noteId: string, email: string) {
    logger.debug('NoteService.share(%s, %s)', noteId, email);
    try {
      const user = await UserRepository.findOne({ email });
      if (!user) {
        throw new NotFoundException(`user with email: ${email} was not found`);
      }

      // update the note's userIds list
      const updates = {
        $push: {
          userIds: user._id,
        }
      }

      await NoteRepository.update(noteId, updates);
      return asApiResponse(null, 'Successfully shared user note');
    } catch(error: any) {
      if (error instanceof ApplicationError) {
        throw error;
      }

      logger.error('Failed to share user note. %o', error);
      throw new InternalServerException('An error occured while sharing user note');
    }
  }

  /**
   * Delete user note
   */
  async delete(noteId: string) {
    logger.debug('NoteService.delete(%s)', noteId);
    try {
      await NoteRepository.deleteById(noteId);
      return asApiResponse(null, 'Successfully deleted user note');
    } catch(error: any) {
      logger.error('Failed to delete user note. %o', error);
      throw new InternalServerException('An error occured while deleting user note');
    }
  }

  async search(userId: string, keyword: string) {
    logger.debug('NoteService.search(%s, %s)', userId, keyword);
    try {
      const notes = await NoteRepository.find({
        userIds: userId,
        $text: {
          $search: keyword
        }
      });
      return asApiResponse(notes, 'Successfully retrieved to message');
    } catch(error: any) {
      logger.error('Failed to retrieved agent notes. %o', error);
      throw new InternalServerException('An error occured while retrieving agent notes');
    }
  }
}

export default new NoteService();
