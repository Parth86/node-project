const mongoose = require('mongoose');

const UserSchema = new  mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    code:{
        type: String,
        default: null
    },
    email:{
        type: String,
        default: null,
        unique: [true, 'Email already present']
    },
    phone:{
        type: String,
        required: true,
        unique: [true, 'Phone Number already present'],
        length: 10
    },
    password:{
        type: String,
        required: true
    },
    api_token:{
        type: String,
        default: null
    },
    role:{
        type: Number,
        required: true
    },
    status:{
        type: Number,
        default: 1 
    }
}, {timestamps: true})

module.exports = mongoose.model('User', UserSchema)