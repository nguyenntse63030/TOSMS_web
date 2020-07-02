const mongoose = require('mongoose');
const Camera = mongoose.model('Camera');
const Tree = mongoose.model('Tree');
const awsServices = require('../services/awsServices');
const { response } = require('express');
const responseStatus = require('../../../configs/responseStatus');

let getListCamera = async (query) => {
    let result = {};
    if (query.start && query.length) {
        let start = parseInt(query.start);
        let length = parseInt(query.length)
        let regex = new RegExp(query.search.value, 'i');
        let cameras = await Camera.find({ $or: [{ code: regex }, { status: regex }] }).skip(start).limit(length).sort({ createdTime: -1 });
        let recordsTotal = await Camera.countDocuments();
        let recordsFiltered = await Camera.countDocuments({ $or: [{ name: regex }, { status: regex }] })
        result = {
            recordsTotal: recordsTotal,
            recordsFiltered: recordsFiltered,
            data: cameras
        }
    } else {
        let cameras = await Camera.find().sort({ createdTime: -1 });
        result.data = cameras
    }
    return responseStatus.Code200(result);
}

let createCamera = async (data, file) => {
    let camera = data;
    await validateDataCamera(camera, file);
    let pathImg = await awsServices.uploadImageToS3('cameraImg', file.image);
    camera.image = pathImg;
    let result = await Camera.create(camera);
    if (!result) {
        throw responseStatus.Code400({ errorMessage: responseStatus.CAMERA_CREATE_FAIL });
    }
    return responseStatus.Code200({ message: responseStatus.CAMERA_CREATE_SUCCESS });
}

let validateDataCamera = async (camera, file) => {
    if (!camera.code) {
        throw responseStatus.Code400({ errorMessage: responseStatus.CAMERA_CODE_IS_CANT_EMPTY });
    }

    if (!camera.ipAddress) {
        throw responseStatus.Code400({ errorMessage: responseStatus.CAMERA_IP__IS_CANT_EMPTY });
    }

    if (!file) {
        throw responseStatus.Code400({ errorMessage: responseStatus.CAMERA_IMAGE__IS_CANT_EMPTY });
    }

    if (camera.tree) {
        let tree = await Tree.findById({ _id: camera.tree }).populate('camera');
        if (!tree) {
            throw responseStatus.Code400({errorMessage: responseStatus.TREE_IS_NOT_FOUND});
        }
        if (tree.camera) {
            throw responseStatus.Code400({errorMessage: responseStatus.TREE_ONLY_HAVE_ONE_CAMERA});
        }
    }
}
module.exports = {
    getListCamera,
    createCamera
}