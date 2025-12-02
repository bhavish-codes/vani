const mongoose= require('mongoose')
const mongourl= process.env.MONGO_CONN

mongoose.connect(mongourl)
.then(()=>{
    console.log('coneected')
}).catch((err)=>{
    console.log('conection err',err)
})