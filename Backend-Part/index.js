import express from 'express'
import { PORT } from './configuration/serverConfig.js';
import connectDb from './configuration/dbConfig.js';

const app = express();

app.listen(PORT,async ()=>{
    await connectDb();
    console.log(`Server is started at ${PORT}`);
    
})