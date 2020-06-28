const mongoose = require('mongoose');

var CitySchema = new mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
    district: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District'
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

mongoose.model('City', CitySchema);