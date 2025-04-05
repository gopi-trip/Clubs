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

// Routes
import userRoutes from './routes/users.route.js'
app.use("/api/v1/users", userRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err);
    
    const statusCode = err instanceof ApiError ? err.statusCode : 500;
    const message = err.message || "Something went wrong";
    const errors = err.errors || [];
    
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors
    });
});
export { app }