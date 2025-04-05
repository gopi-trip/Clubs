import express from 'express'
import cors from 'cors'

//Creating an app
const app = express();

//Middlewares

//CORS
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials:true
    })
);

//EXPRESS
app.use(express.json({limit:"200kb"}))
app.use(express.urlencoded({extended: true,limit: "200kb"}))
app.use(express.static("public"))

export { app }