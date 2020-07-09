const mongoose = require('mongoose')
const Tree = mongoose.model('Tree')
const Ward = mongoose.model('Ward')
const City = mongoose.model('City');
const District = mongoose.model('District');
const Notification = mongoose.model('Notification');
const responseStatus = require('../../../configs/responseStatus')
const common = require('../../common')
const jwt = require('jsonwebtoken')
const AWS = require('aws-sdk')
const config = require('../../../config')
const awsServices = require("../services/awsServices");
const constant = require('../../../configs/constant')

let createTree = async (data, file) => {
    let tree = data;
    let ward = await Ward.findById({ _id: data.ward });
    let district = await District.findById({ _id: data.district });
    let city = await City.findById({ _id: data.city });
    if (!ward || !district || !city) {
        throw responseStatus.Code400({ errorMessage: responseStatus.LOCATION_WRONG });
    }
    let regex = new RegExp(tree.code, 'i');
    let checkExist = await Tree.findOne({ code: regex });

    if (checkExist) {
        throw responseStatus.Code400({ errorMessage: responseStatus.TREE_CODE_IS_DUPLICATE })
    }
    tree.image = file.image;
    common.validateDataTree(tree);
    tree.city = tree.city;
    tree.district = tree.district;
    tree.ward = tree.ward;
    tree.wardName = ward.name;
    tree.districtName = district.name;
    tree.cityName = city.name;
    tree.latitude = parseFloat(tree.latitude);
    tree.longitude = parseFloat(tree.longitude);
    tree.googleMapsUrl = common.createMapsUrl(tree.latitude, tree.longitude)
    let pathImg = await awsServices.uploadImageToS3('treeImage', file.image);
    tree.image = pathImg;
    let _tree = await Tree.create(tree);
    return responseStatus.Code200({ message: 'Tạo cây thành công.' });
}

let updateTree = async (id, data) => {
    let tree = await Tree.findOne({ _id: id, isActive: true }).populate('camera');
    if (!tree) {
        throw responseStatus.Code400({ errorMessage: responseStatus.TREE_IS_NOT_FOUND });
    }
    let ward = await Ward.findById({ _id: data.ward });
    let district = await District.findById({ _id: data.district });
    let city = await City.findById({ _id: data.city });
    if (!ward || !district || !city) {
        throw responseStatus.Code400({ errorMessage: responseStatus.LOCATION_WRONG });
    }
    tree.treeType = data.treeType || tree.treeType;
    tree.street = data.street || tree.street;
    tree.note = data.note || tree.note;
    tree.description = data.description || tree.description;
    tree.ward = data.ward || tree.ward;
    tree.wardName = ward.name;
    tree.district = data.district || tree.district;
    tree.districtName = district.name;
    tree.city = data.city || tree.city;
    tree.cityName = city.name;
    tree.modifiedTime = Date.now();
    tree.longitude = data.longitude || tree.longitude;
    tree.latitude = data.latitude || tree.latitude;
    tree.googleMapsUrl = common.createMapsUrl(tree.latitude, tree.longitude);
    let _tree = await tree.save();
    if (_tree !== tree) {
        throw responseStatus.Code400({ errorMessage: responseStatus.UPDATE_TREE_FAIL });
    }
    return responseStatus.Code200({ message: responseStatus.UPDATE_TREE_SUCCESS, tree: _tree });
}

let uploadImage = async (id, file) => {
    let tree = await Tree.findOne({ _id: id, isActive: true }).populate('camera');
    if (!tree) {
        throw responseStatus.Code400({ errorMessage: responseStatus.TREE_IS_NOT_FOUND });
    }
    let pathImg = await awsServices.uploadImageToS3('treeImage', file.image);
    tree.image = pathImg || tree.image;
    let _tree = await tree.save();
    if (_tree !== tree) {
        throw responseStatus.Code400({ errorMessage: responseStatus.TREE_UPLOAD_IMAGE_FAIL });
    }
    return responseStatus.Code200({ message: responseStatus.TREE_UPLOAD_IMAGE_SUCCESS, tree: _tree });
}

let deleteTree = async (id) => {
    let tree = await Tree.findOne({ _id: id, isActive: true });
    if (!tree) {
        throw responseStatus.Code400({ errorMessage: responseStatus.TREE_IS_NOT_FOUND });
    }

    tree.isActive = false
    let _tree = await tree.save();
    if (_tree !== tree) {
        throw responseStatus.Code400({ errorMessage: responseStatus.DELETE_TREE_FAIL });
    }
    return responseStatus.Code200({ message: responseStatus.DELETE_TREE_SUCCESS });
}

let getDetailTree = async (id) => {
    let poputlateOpt = { path: 'camera', match: { isActive: true } }
    let tree = await Tree.findOne({ _id: id, isActive: true }).populate(poputlateOpt);
    if (!tree) {
        throw responseStatus.Code400({ errorMessage: responseStatus.TREE_IS_NOT_FOUND });
    }
    return responseStatus.Code200({ tree });
}

let getListTree = async (query) => {
    let result = {}
    if (query.start && query.length) {
        let start = parseInt(query.start);
        let length = parseInt(query.length)
        let regex = new RegExp(query.search.value, 'i');
        let trees = await Tree.find({ $and: [{ $or: [{ note: regex }, { treeType: regex }, { street: regex }, { wardName: regex }, { districtName: regex }, { cityName: regex }] }, { isActive: true }] }).skip(start).limit(length).sort({ createdTime: -1 }).populate('district', { ward: 0 }).
            populate('ward').populate('city', { city: 0 }).exec();
        let recordsTotal = await Tree.countDocuments({ isActive: true });
        let recordsFiltered = await Tree.countDocuments({ $and: [{ $or: [{ note: regex }, { treeType: regex }, { street: regex }, { wardName: regex }, { districtName: regex }, { cityName: regex }] }, { isActive: true }] })

        result = {
            recordsTotal: recordsTotal,
            recordsFiltered: recordsFiltered,
            data: trees
        }
    } else {
        let trees = await Tree.find({ isActive: true, camera: null }).sort({ createdTime: -1 })
        result.data = trees
    }
    return responseStatus.Code200(result);
}

let getListNotiOfTree = async (req) => {
    let id =  req.params.id;
    let query = req.query;
    let start = parseInt(query.start);
    let length = parseInt(query.length);
    let startDate = parseInt(query.startDate);
    let endDate = parseInt(query.endDate)
    let regex = new RegExp(query.search.value, 'i');
    let tree = await Tree.findOne({ _id: id, isActive: true });
    if (!tree) {
        throw responseStatus.Code400({ errorMessage: responseStatus.TREE_IS_NOT_FOUND });
    }
    let queryOpt = { $and: [{ $or: [{ name: regex }, { status: regex }] }, { tree: tree._id }, { createdTime: { $gt: startDate, $lt: endDate} }] };
    let queryCount = {};
    let queryFilter = { $and: [{ $or: [{ name: regex }, { status: regex }] }, { tree: tree._id }, { createdTime: { $gt: startDate, $lt: endDate } }] };
   
    if (req.user.role === constant.userRoles.WORKER) {
        queryOpt = { $and: [{ $or: [{ name: regex }, { status: regex }] }, { tree: tree._id }, { createdTime: { $gt: startDate, $lt: endDate} }, {worker: req.user.id}] };
        queryCount = {worker: req.user.id};
        queryFilter = { $and: [{ $or: [{ name: regex }, { status: regex }] }, { tree: tree._id }, { createdTime: { $gt: startDate, $lt: endDate } }, {worker: req.user.id}] };
    }

    let notifications = await Notification.find(queryOpt).skip(start).limit(length).sort({ createdTime: -1 });
    let recordsTotal = await Notification.countDocuments(queryCount);
    let recordsFiltered = await Notification.countDocuments(queryFilter)
    let result = {
        recordsTotal: recordsTotal,
        recordsFiltered: recordsFiltered,
        data: notifications
    }
    return responseStatus.Code200(result);
}

module.exports = {
    createTree,
    updateTree,
    getDetailTree,
    getListTree,
    getListNotiOfTree,
    deleteTree,
    uploadImage
}