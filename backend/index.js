const express=require('express');
const app=express();

require('dotenv').config();
const PORT =process.env.PORT || 8080

const cors=require('cors')
const router = require('./src/routes/AuthRoutes')

require('./src/modles/db')

// Enable CORS first
app.use(cors())

// Then parse JSON
app.use(express.json())

app.get('/ping',(req,res)=>{
    res.send('pong')
})

app.use('/auth',router)








app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`);
}) 