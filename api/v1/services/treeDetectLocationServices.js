const mongoose = require('mongoose')
const common = require('../../common')
const responseStatus = require('../../../configs/responseStatus');
const constant = require('../../../configs/constant')
const TreeDetectLocation = mongoose.model('TreeDetectLocation')

async function createTreeDetectLocation(data) {
    let treeDetectLocation = await TreeDetectLocation.create(data)
    return responseStatus.Code200({ message: responseStatus.CREATE_TREE_DETECT_LOCATION_SUCCESSFULLY, treeDetectLocation: treeDetectLocation })
}

async function getAll() {
    let result = await TreeDetectLocation.find()
    return responseStatus.Code200({treeDetectLocatin: result})
}

async function getByCameraID(cameraID) {
    let result = await TreeDetectLocation.find({camera: cameraID})
    return responseStatus.Code200({treeDetectLocation: result})
}

module.exports = {
    getAll,
    getByCameraID,
    createTreeDetectLocation
}