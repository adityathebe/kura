const mongoose = require('mongoose');

let categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    stream : {
        type: String,
        required: true
    },
    year : {
        type : Number,
        required: true
    },
    sem: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('category', categorySchema);
