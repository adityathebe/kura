const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    username  : { type: String, required : true },
    firstName : { type: String, required : true },
    lastName  : { type: String, required : true },
    email     : { type: String, required : true },
    password  : { type: String, required : true },
    gender    : { type: String, required : true },
    imgsrc    : { type: String, required : false},
    admin     : { type: Boolean, default : false},
    bio       : { type: String, required : false},
    faculty   : { type: String, required : true },
    year      : { type: Number, required : true },
    semester  : { type: Number, required : true },
    joined    : { type: Date,   required : true }
});

module.exports = mongoose.model('User', userSchema);