const common = require('../../common')
const responseStatus = require('../../../configs/responseStatus');
const awsServices = require('../services/awsServices')
const constant = require('../../../configs/constant')
const notificationController = require('../controllers/notificationController')
const treeDetectLocationServices = require('./treeDetectLocationServices');
const { NotExtended } = require('http-errors');

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
    let notificationData = {
        description: '',
        image: data.image,
        cameraId: data.camera_id,
        imageDetected: data.imageDetected,
        // createdTime: new Date(data.timestamp).getTime() || Date.now()
        createdTime: Date.now()
    }
    if (data.result.length > 0) {
        notificationData.name = await checkResult(data.result, data.camera_id)
    } else {
        notificationData.name = constant.treeProblemDisplay.CANT_DETECT
        let treeDetectLocationData = {
            object: '',
            camera: data.camera_id,
            xmin: 0,
            ymin: 0,
            xmax: 0,
            ymax: 0
        }
        await treeDetectLocationServices.createTreeDetectLocation(treeDetectLocationData)
    }

    let notification = await notificationController.createNotification(notificationData)
    return notification
}

async function checkResult(result, cameraID) {
    let name = ''
    for (let problem of result) {
        if (problem.object !== constant.treeProblem.TREE_BODY) {
            let treeDetectLocationData = {
                object: problem.object,
                camera: cameraID,
                xmin: problem.xmin,
                ymin: problem.ymin,
                xmax: problem.xmax,
                ymax: problem.ymax
            }
            await treeDetectLocationServices.createTreeDetectLocation(treeDetectLocationData)
            switch (problem.object) {
                case constant.treeProblem.BROKEN_BRANCH:
                    name += constant.treeProblemDisplay.BROKEN_BRANCH + ' - '
                    break;

                case constant.treeProblem.INCLINED_TREE:
                    if (problem.degrees) {
                        let degrees = Math.round(problem.degrees)
                        name += constant.treeProblemDisplay.INCLINED_TREE + ' ' + degrees + ' độ - '
                    }
                    break;

                default:
                    name += constant.treeProblemDisplay.ELECTRIC_WIRE + ' - '
                    break;
            }
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
    data.result = data.result.split("'").join('"');
    data.result = JSON.parse(data.result)
    // if (common.isEmptyObject(data.result)) {
    //     // throw responseStatus.Code400({ errorMessage: responseStatus.DATA_IS_NOT_FOUND })
    //     return responseStatus.Code200({ message: responseStatus.PROCESS_DATA_FROM_PYTHON_SUCCESSFULLY })
    // }
    let fileURLs = await processImage(files)
    data = Object.assign({}, data, fileURLs);
    let result = await processData(data)
    notificationController.sendNotification(result, constant.notiCollection.MANAGER);
    return responseStatus.Code200({ message: responseStatus.PROCESS_DATA_FROM_PYTHON_SUCCESSFULLY })
}

module.exports = {
    processDataFromPython
}