const mongoose = require('mongoose');

var LocationSchema = new mongoose.Schema({
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City'
    },
    ward: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ward'
    },
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District'
    },
    street: {
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


mongoose.model('Location', LocationSchema);