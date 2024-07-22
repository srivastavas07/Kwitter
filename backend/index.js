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

//adding middleware to the app
app.use(express.urlencoded({extended:true}));
export const original = "https://localhost:3000"

//cors basically tells the backend the origin from where the request is coming. to avoid any unauthorised access.
const corsOption = {
    origin:"https://localhost:3000",
    credentials:true,
    methods:["GET","POST","PUT","DELETE"]
}
app.options("*",cors(corsOption));
app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/user",userRoutes);
app.use("/api/v1/tweet",tweetRoutes);
app.get("/",(res,req)=>{
    req.send("Server is running");
});

const Port = process.env.PORT;
app.listen(Port,()=>{
    console.log('Server Running at '+Port);
})

export default app;
//ye tha issue export default iske wajah se nahi chal rha tha
