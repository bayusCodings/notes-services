import { Schema, model } from 'mongoose';
import { IUser } from '../interfaces/user.interface';

import bcrypt from 'bcrypt';

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function(next) {
  let user = this;
  if (user.isModified('password')) {
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
    next();
  } else {
    next();
  }
});

export default model<IUser>('User', userSchema);