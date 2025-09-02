import mongoose from 'mongoose'
import { MONGO_URL } from './serverConfig.js'

export default async function connectDb() {
    try {
       await mongoose.connect(MONGO_URL);
       console.log('SucessFully connected to the DataBase');

    } catch (error) {
        console.log('Failed to connect with Database');
        throw error;
    }
}