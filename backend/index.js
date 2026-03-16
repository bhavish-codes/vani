const express=require('express');//used to create server and handle routes
const mongoose = require('mongoose');//used to connect to MongoDB and define schemas/models
const app=express();

require('dotenv').config();


const cors=require('cors')
const router = require('./src/routes/AuthRoutes')

require('./src/modles/db')

// Validate environment variables
if (!process.env.MONGO_CONN || !process.env.JWT_SECRET) {
    console.warn('Warning: Required environment variables MONGO_CONN or JWT_SECRET are missing');
}

// Enable CORS first
app.use(cors({
  origin: "https://vani-app.vercel.app"
}))

// Then parse JSON
app.use(express.json())

app.get('/ping',(req,res)=>{
    const connectionState = mongoose.connection.readyState;
    const status =
        connectionState === 1
            ? 'Connected'
            : connectionState === 2
            ? 'Connecting'
            : connectionState === 3
            ? 'Disconnecting'
            : 'Disconnected';

    console.log('Database status check:', status);
    res.json({ 
        status,
        mongoConnConfigured: !!process.env.MONGO_CONN,
        jwtSecretConfigured: !!process.env.JWT_SECRET
    });
})

app.use('/auth',router)
module.exports = app;






