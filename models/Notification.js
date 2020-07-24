const mongoose = require('mongoose');
const constants = require('../configs/constant')

var NotificationSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
    discription: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    imageDetected: {
        type: String,
        defaul: ''
    },
    tree: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tree'
    },
    worker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        default: constants.priorityStatus.CHUA_XU_LY,
        enum: constants.priorityStatuEnums
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


NotificationSchema.post('save', async function (notification) {
    notification = await notification.populate('worker').execPopulate();
    return notification;
})

NotificationSchema.pre('save', function () {
    this.modifiedTime = Date.now()
})
mongoose.model('Notification', NotificationSchema);