import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import postRouter from "./routes/post.routes.js";
import pyqRouter from "./routes/Pyq.routes.js"

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN, 
    credentials: true 
}))

app.use(express.json({
    limit: "10kb"
}));

app.use(express.urlencoded({extended: true, limit:"15kb"}));

app.use(express.static("public"));

app.use(cookieParser());


//routes
import userRouter from './routes/user.routes.js'


//routes declaration
app.use("/users", userRouter);

app.use("/posts", postRouter);

app.use("/pyqs" , pyqRouter);


export {app};