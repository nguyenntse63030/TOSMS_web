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
    image: {
        type: String,
        default: '/images/logo/LogoTree.jpg'
    },
    longitude: {
        type: Number,
        default: 0
    },
    latitude: {
        type: Number,
        default: 0
    },
    googleMapsUrl: {
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

mongoose.model('Tree', TreeSchema);