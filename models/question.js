const mongoose = require('mongoose');

// Question Schema
let questionSchema = mongoose.Schema({
    title:      { type: String, required: true },
    author :    { type: String, required: true },
    category :  { type: String, required: true },
    body:       { type: String, required : false },
    votes:      { type: Number, default : 0 },
    createdAt:  { type: Date, default: new Date() },
    updatedAt:  { type: Date, default: new Date() }
});

module.exports = mongoose.model('Question', questionSchema);