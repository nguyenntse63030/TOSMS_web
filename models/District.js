const mongoose = require('mongoose');
const constants = require('../configs/constant')

var DistrictSchema = new mongoose.Schema({
    id: {
        type: Number
    },
    name: {
        type: String,
        default: ''
    },
    ward: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ward'
    }],
    type: {
        type: String,
        default: ''
    },
    cityID: {
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

mongoose.model('District', DistrictSchema);