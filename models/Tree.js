const mongoose = require('mongoose');
const constants = require('../configs/constant');

var TreeSchema = new mongoose.Schema({
    treeType: {
        type: String,
        default: ''
    },
    code: {
        type: String,
        required: true,
    },
    note: {
        type: String,
        default: constants.treeProblemDisplay.NO_PROBLEM
    },
    description: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City'
    },
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District'
    },
    ward: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ward'
    },
    camera: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Camera'
    },
    cityName: {
        type: String,
        default: ''
    },
    districtName: {
        type: String,
        default: ''
    },
    wardName: {
        type: String,
        default: ''
    },
    street: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: constants.imageDefault
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

TreeSchema.pre('save', function () {
    this.modifiedTime = Date.now()
})

mongoose.model('Tree', TreeSchema);