const common = require('../../common')
const responseStatus = require('../../../configs/responseStatus');
const awsServices = require('../services/awsServices')
const sql = require('../services/sqlSevices');
const constant = require('../../../configs/constant')
const mssql = require('mssql')

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
    let sqlData = {
        name: checkResult(data.result),
        description: '',
        image: data.image,
        imageDetected: data.imageDetected,
        createdTime: new Date(data.timestamp).getTime()
    }

    let DB = await sql.connection()
    if (DB.message) {
        throw responseStatus.Code400({errorMessage: responseStatus.CONNECTION_TO_DB_FAIL})
    }
    try {
        const request = DB.request()
        request.input('name', mssql.NVarChar, sqlData.name || '')
        request.input('description', mssql.NVarChar, sqlData.description || '')
        request.input('image', mssql.NVarChar, sqlData.image || '')
        request.input('imageDetected', mssql.NVarChar, sqlData.imageDetected || '')
        request.input('createdTime', mssql.BigInt, sqlData.createdTime || Date.now())

        let query = 'INSERT INTO Notification (name, description, image, imageDetected, createdTime) VALUES(@name, @description, @image, @imageDetected, @createdTime)'
        const result = await request.query(query)

        return result.rowsAffected.length > 0;
    }
    catch (err) {
        console.log('Error querying database', err);
        throw responseStatus.Code400(err)
    }
    finally {
        DB.close();
        console.log('DB closed')
    }
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
    let fileURLs = await processImageFromPython(files)
    data = Object.assign({}, data, fileURLs);
    await processData(data)
    return responseStatus.Code200({ message: responseStatus.PROCESS_DATA_FROM_PYTHON_SUCCESSFULLY })
}

module.exports = {
    processDataFromPython
}
