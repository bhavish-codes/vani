const mongoose = require('mongoose')
const scheema = mongoose.Schema

const userschema= new scheema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})
const model=mongoose.model('users',userschema)
module.exports=model