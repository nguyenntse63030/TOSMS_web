const mongoose = require('mongoose');
const constants = require('../configs/constant');

var TreeDetectLocationSchema = new mongoose.Schema({
    object: {
        type: String,
        default: ''
    },
    camera: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Camera'
    },
    tree: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tree'
    },
    xmin: {
        type: Number,
        default: 0
    },
    ymin: {
        type: Number,
        default: 0
    },
    xmax: {
        type: Number,
        default: 0
    },
    ymax: {
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

mongoose.model('TreeDetectLocation', TreeDetectLocationSchema);