const common = require('../../common')
const responseStatus = require('../../../configs/responseStatus');
const awsServices = require('../services/awsServices')
const constant = require('../../../configs/constant')
const notificationController = require('../controllers/notificationController')

async function processImage(files) {
    if (!files) {
        throw responseStatus.Code400({ errorMessage: responseStatus.FILES_IS_NOT_FOUND })
    }
    let fileURLs = {}
    for (let key in files) {
        let file = files[key]
        let fileURL = await awsServices.uploadImageToS3(key, file)
        fileURLs[key] = fileURL
    }
    return fileURLs
}

async function processData(data) {
    data.result = JSON.parse(data.result)
    let notificationData = {
        name: checkResult(data.result),
        description: '',
        image: data.image,
        cameraId: data.camera_id,
        imageDetected: data.imageDetected,
        createdTime: new Date(data.timestamp).getTime() || Date.now()
    }

    let notification = await notificationController.createNotification(notificationData)
    return notification
}

function checkResult(result) {
    let name = ''
    for (let key in result) {
        switch (key) {
            case constant.treeProblem.BROKEN_BRANCH:
                name += constant.treeProblemDisplay.BROKEN_BRANCH + ' - '
                break;

            case constant.treeProblem.INCLINED_TREE:
                name += constant.treeProblemDisplay.INCLINED_TREE + ' - '
                break;
                
            case constant.treeProblem.ELECTRIC_WIRE:
                name += constant.treeProblemDisplay.ELECTRIC_WIRE + ' - '
        }
    }
    if (name) {
        name = name.slice(0, name.lastIndexOf(' ') - 2)
    }
    return name
}


async function processDataFromPython(data, files) {
    if (common.isEmptyObject(data)) {
        throw responseStatus.Code400({ errorMessage: responseStatus.DATA_IS_NOT_FOUND })
    }
    if (common.isEmptyObject(data.result)) {
        throw responseStatus.Code400({ errorMessage: responseStatus.DATA_IS_NOT_FOUND })
    }
    let fileURLs = await processImage(files)
    data = Object.assign({}, data, fileURLs);
    let result = await processData(data)
    notificationController.sendNotification(result);
    return responseStatus.Code200({ message: responseStatus.PROCESS_DATA_FROM_PYTHON_SUCCESSFULLY })
}

module.exports = {
    processDataFromPython
}