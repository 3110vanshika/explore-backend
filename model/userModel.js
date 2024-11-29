const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    created_by:{
        type:String,
        require:true
    },
    fullname:{
        type:String,
        require: true
    },
    email:{
        type:String,
        require: true,
        unique: true
    },
    password:{
        type:String,
        require: true
    },
    image:{
        type: String
    },
}, {timestamps: true})

module.exports =  mongoose.model("users", userSchema)