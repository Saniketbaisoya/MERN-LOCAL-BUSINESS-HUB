import express, { urlencoded } from 'express'
import { PORT } from './configuration/serverConfig.js';
import connectDb from './configuration/dbConfig.js';
import userRouter from './routes/user.router.js'
import authRouter from './routes/auth.route.js'
import cookieParser from 'cookie-parser';
import listingRouter from './routes/listing.route.js'
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}))
app.use(cookieParser());

app.use('/api/user',userRouter);
app.use('/api',authRouter);
app.use('/api/listing',listingRouter);
app.listen(PORT,async ()=>{
    await connectDb();
    console.log(`Server is started at ${PORT}`);
    
})