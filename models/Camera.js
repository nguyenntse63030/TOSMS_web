const mongoose = require('mongoose');
const constants = require('../configs/constant')

var CameraSchema = new mongoose.Schema({
    isActive: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        default: constants.cameraStatus.DANG_HOAT_DONG,
        enum: constants.cameraStatusEnums
    },
    tree: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tree'
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

mongoose.model('Camera', CameraSchema);