import express from 'express'
import { PORT } from './configuration/serverConfig.js';
import connectDb from './configuration/dbConfig.js';
import userRouter from './routes/user.router.js'
const app = express();

app.use('/api/user',userRouter);
app.listen(PORT,async ()=>{
    await connectDb();
    console.log(`Server is started at ${PORT}`);
    
})