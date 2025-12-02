const express=require('express');
const mongoose = require('mongoose');
const app=express();

require('dotenv').config();
const PORT =process.env.PORT || 8080

const cors=require('cors')
const router = require('./src/routes/AuthRoutes')

require('./src/modles/db')

// Validate environment variables
console.log('=== Environment Variables Check ===');
console.log('PORT:', PORT);
console.log('MONGO_CONN:', process.env.MONGO_CONN ? 'Set ✓' : 'NOT SET ✗');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set ✓' : 'NOT SET ✗');

if (!process.env.MONGO_CONN) {
    console.error('ERROR: MONGO_CONN environment variable is not set!');
    console.error('Please set MONGO_CONN in your environment variables or .env file');
}

if (!process.env.JWT_SECRET) {
    console.error('ERROR: JWT_SECRET environment variable is not set!');
    console.error('Please set JWT_SECRET in your environment variables or .env file');
}

// Enable CORS first
app.use(cors())

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

    console.log('[PING] Database status:', status);
    res.json({ 
        status,
        mongoConnConfigured: !!process.env.MONGO_CONN,
        jwtSecretConfigured: !!process.env.JWT_SECRET
    });
})

app.use('/auth',router)








app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`);
    console.log('Server URL: http://localhost:' + PORT);
})