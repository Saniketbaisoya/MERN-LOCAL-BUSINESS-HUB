import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

export const PORT = process.env.PORT || 9000;
export const MONGO_URL = process.env.MONGODB_URL;
export const SECRET_KEY = process.env.SECRET_KEY;