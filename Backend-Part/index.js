import dotenv from 'dotenv'
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from parent directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import express, { urlencoded } from 'express'
import { PORT } from './configuration/serverConfig.js';
import connectDb from './configuration/dbConfig.js';
import userRouter from './routes/user.router.js'
import authRouter from './routes/auth.route.js'
import cookieParser from 'cookie-parser';
import listingRouter from './routes/listing.route.js'
import chatRouter from './routes/chat.route.js'

const rootDir = path.resolve();
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}))
app.use(cookieParser());

app.use('/api/user',userRouter);
app.use('/api',authRouter);
app.use('/api/listing',listingRouter);
app.use('/api/chat', chatRouter);


app.use(express.static(path.join(rootDir, '/Local-Buisness-Hub/dist')));

app.get('/*any',(req,res)=> {
    res.sendFile(path.join(rootDir, 'Local-Buisness-Hub', 'dist', 'index.html'))
})
app.listen(PORT,async ()=>{
    await connectDb();
    console.log(`Server is started at ${PORT}`);
})