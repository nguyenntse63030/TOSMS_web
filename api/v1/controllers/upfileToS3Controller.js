const mongoose = require('mongoose')
const responseStatus = require('../../../configs/responseStatus')

const Apartment = mongoose.model('Apartment')


// const User = mongoose.model('User')
// const roomController = require('./roomController')


async function getUpFileToS3() {
    let apartments = await Apartment.find().populate('manager', 'name')
    return responseStatus.Code200({ apartments: apartments })
}

module.exports = {
    getUpFileToS3
}