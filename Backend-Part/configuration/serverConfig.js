import dotenv from 'dotenv'

dotenv.config();

export const PORT = process.env.PORT || 9000;
export const MONGO_URL = process.env.MONGODB_URL;
export const SECRET_KEY = process.env.SECRET_KEY;