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
    cityId: {
        type: Number
    },
    districtId: {
        type: Number
    },
    wardId: {
        type: Number
    },
    street: {
        type: String,
        default: ''
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