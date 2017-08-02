const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    username  : { type: String, required : true },
    firstName : { type: String, required : true },
    lastName  : { type: String, required : true },
    email     : { type: String, required : true },
    password  : { type: String, required : true },
    gender    : { type: String, required : true },
    faculty   : { type: String, required : true },
    year      : { type: Number, required : true },
    semester  : { type: Number, required : true },
});

module.exports = mongoose.model('User', userSchema);