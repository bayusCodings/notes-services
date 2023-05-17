import { Types } from 'mongoose';

export interface INote {
  _id?: Types.ObjectId;
  userIds: Array<Types.ObjectId | string>;
  title: string;
  content: string;
}

export interface CreateNoteRequest {
  userId: string;
  title: string;
  content: string;
}


export interface UpdateNoteRequest {
  title: string;
  content: string;
}