//erros encountered always use .js extension for backend file. else ull get errors..
import express from 'express';
import dotenv from 'dotenv';
import databaseConnection from './config/database.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import tweetRoutes from './routes/tweetRoutes.js';
import cors from "cors";

dotenv.config({
    path:'.env'
})
//this will speicfy the path where the env file exists.

databaseConnection();
const app = express();
export const original = "http://localhost:3000";
//adding middleware to the app
app.use(express.urlencoded({extended:true}));
//cors basically tells the backend the origin from where the request is coming. to avoid any unauthorised access.
const corsOption = {
    origin:"http://localhost:3000",
    credentials:true,

}
app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/user",userRoutes);
app.use("/api/v1/tweet",tweetRoutes);

const Port = process.env.PORT;
app.get( '/',(req,res)=>{
     res.send("Hello World");
})