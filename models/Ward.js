const mongoose = require('mongoose');

var WardSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
    modifiedTime: {
        type: Number,
        default: Date.now
    },
    createdTime: {
        type: Number,
        default: Date.now
    },
});

mongoose.model('Ward', WardSchema);