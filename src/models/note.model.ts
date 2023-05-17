import { Schema, SchemaTypes, model } from 'mongoose';
import { INote } from '../interfaces/note.interface';

const noteSchema = new Schema<INote>(
  {
    userIds: [
      {
        type: SchemaTypes.ObjectId,
        ref: 'User'
      }
    ],
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

noteSchema.index({
  content: 'text'
});

export default model<INote>('Note', noteSchema);
