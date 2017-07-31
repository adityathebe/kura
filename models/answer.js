const mongoose = require('mongoose');

// Answer Schema
let answerSchema = mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    author : {
        type: String,
        required: true
    },
    votes: {
        type: Number,
        default: 0
    },
    parent: {
        type: String,
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date()
    },
    updatedAt: {
        type: Date,
        default: Date()
    }
});

let Answer = module.exports = mongoose.model('Answer', answerSchema);