const mongoose = require('mongoose');

var TreeSchema = new mongoose.Schema({
    treeType: {
        type: String,
        default: ''
    },
    note: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location'
    },
    longitude: {
        type: Number,
        default: 0
    },
    latitude: {
        type: Number,
        default: 0
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

mongoose.model('Tree', TreeSchema);