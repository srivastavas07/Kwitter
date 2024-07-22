//erros encountered always use .js extension for backend file. else ull get errors..
import express from 'express';
import dotenv from 'dotenv';
import databaseConnection from './config/database.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import tweetRoutes from './routes/tweetRoutes.js';
import cors from "cors";
import serverless from "serverless-http";
import favicon from 'serve-favicon';
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
app.get("/",(res,req)=>{
    req.send("Server is running");
});

app.get('/favicon.ico', (req, res) => (
    res.status(200).sendFile('favicon.ico', {root: __dirname + '/static/'})
));

const Port = process.env.PORT;
app.listen(Port,()=>{
    console.log('Server Running at '+Port);
})

export const handler = serverless(app);
