const mongoose = require('mongoose');
const constants = require('../configs/constant')

var DistrictSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
    ward: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ward'
    }],
    street: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Street'
    }],
    modifiedTime: {
        type: Number,
        default: Date.now
    },
    createdTime: {
        type: Number,
        default: Date.now
    },
});

mongoose.model('District', DistrictSchema);