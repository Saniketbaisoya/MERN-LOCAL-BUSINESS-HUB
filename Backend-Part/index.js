import express, { urlencoded } from 'express'
import { PORT } from './configuration/serverConfig.js';
import connectDb from './configuration/dbConfig.js';
import userRouter from './routes/user.router.js'
import authRouter from './routes/auth.route.js'
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}))


app.use('/api/user',userRouter);
app.use('/api',authRouter);
app.listen(PORT,async ()=>{
    await connectDb();
    console.log(`Server is started at ${PORT}`);
    
})