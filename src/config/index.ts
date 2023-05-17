import dotenv from 'dotenv';
dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI;
export const JWT_KEY = process.env.JWT_KEY as string;
