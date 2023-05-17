import { Note } from '../models';
import { INote } from '../interfaces/note.interface';

import MongoRepository from './mongo.repository';

class NoteRepository extends MongoRepository<INote> {
  constructor() {
    super(Note);
  }
}

export default new NoteRepository();
