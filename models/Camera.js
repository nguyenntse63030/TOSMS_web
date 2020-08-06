const mongoose = require('mongoose');
const constants = require('../configs/constant')

var CameraSchema = new mongoose.Schema({
    isActive: {
        type: Boolean,
        default: true
    },
    cameraType: {
        type: String,
        default: ''
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
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District'
    },
    districtName: {
        type: String,
        default: ''
    },
    ipAddress: {
        type: String,
        default: ''
    },
    code: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: constants.imageDefault
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