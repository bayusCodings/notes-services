import { Request, Response } from 'express';
import { NoteService } from '../services';
import { CreateNoteRequest, UpdateNoteRequest } from '../interfaces/note.interface';
import { asApiResponse } from '../types/response.dto';

class NoteController {
  async createNote(req: Request, res: Response) {
    const { title, content } = req.body;
    const { _id } = res.locals.user

    const request: CreateNoteRequest = {
      title, content,
      userId: _id
    }

    const response = await NoteService.create(request);
    return res.status(201).json(response);
  }

  async fetchNotes(req: Request, res: Response) {
    const { _id } = res.locals.user

    const response = await NoteService.fetchNotes(_id);
    return res.status(200).json(response);
  }

  async fetchNote(req: Request, res: Response) {
    const { note } = res.locals;

    const response = asApiResponse(note, 'Successfully retrieved user note')
    return res.status(200).json(response);
  }

  async updateNote(req: Request, res: Response) {
    const { title, content } = req.body;
    const { _id } = res.locals.note;

    const request: UpdateNoteRequest = {
      title, content,
    }

    const response = await NoteService.update(_id, request);
    return res.status(200).json(response);
  }

  async shareNote(req: Request, res: Response) {
    const { email } = req.body;
    const { _id } = res.locals.note;

    const response = await NoteService.share(_id, email);
    return res.status(200).json(response);
  }

  async deleteNote(req: Request, res: Response) {
    const { _id } = res.locals.note;

    const response = await NoteService.delete(_id);
    return res.status(200).json(response);
  }

  async searchNote(req: Request, res: Response) {
    const { q } = req.query;
    const { _id } = res.locals.user

    const response = await NoteService.search(_id, <string> q);
    return res.status(200).json(response);
  }
}

export default new NoteController();
