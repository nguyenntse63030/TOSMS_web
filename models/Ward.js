const mongoose = require('mongoose');

var WardSchema = new mongoose.Schema({
    id: {
        type: Number
    },
    name: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: ''
    },
    districtID: {
        type: Number
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