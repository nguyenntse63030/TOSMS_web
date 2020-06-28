const mongoose = require('mongoose')
const Notification = mongoose.model('Notification')
const responseStatus = require('../../../configs/responseStatus')
const common = require('../../common')
const jwt = require('jsonwebtoken')
const config = require('../../../config')
const constant = require('../../../configs/constant')

async function createNotification(data) {
    let notification = await Notification.create(data)
    if (!notification) {
        throw responseStatus.Code400({errorMessage: responseStatus.CREATE_NOTIFICATION_FAIL})
    }
    responseStatus.Code200({message: responseStatus.CREATE_NOTIFICATION_SUCCESSFULLY})
}



module.exports = {
    createNotification
}