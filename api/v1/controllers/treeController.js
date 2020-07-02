const mongoose = require('mongoose')
const Tree = mongoose.model('Tree')
const Ward = mongoose.model('Ward')
const City = mongoose.model('City');
const District = mongoose.model('District');
const responseStatus = require('../../../configs/responseStatus')
const common = require('../../common')
const jwt = require('jsonwebtoken')
const AWS = require('aws-sdk')
const config = require('../../../config')
const awsServices = require("../services/awsServices");
const constant = require('../../../configs/constant')

let createTree = async (data, file) => {
    let tree = data;
    tree.image = file.image;
    common.validateDataTree(tree);
    tree.city = tree.city;
    tree.district = tree.district;
    tree.ward = tree.ward;

    tree.latitude = parseFloat(tree.latitude);
    tree.longitude = parseFloat(tree.longitude);
    tree.googleMapsUrl = common.createMapsUrl(tree.latitude, tree.longitude)
    let pathImg = await awsServices.uploadImageToS3('treeImage', file.image);
    tree.image = pathImg;
    let _tree = await Tree.create(tree);
    return responseStatus.Code200({ message: 'Tạo cây thành công.' });
}

let getDetailTree = async (id) => {
    let tree = await Tree.findOne({ _id: id });
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
        let trees = await Tree.find({$and: [{ $or: [{ treeType: regex }, { status: regex }] }, {isActive: true}]}).skip(start).limit(length).sort({ createdTime: -1 }).populate('district', { ward: 0 }).
            populate('ward').populate('city', { city: 0 }).exec();
        let recordsTotal = await Tree.countDocuments();
        let recordsFiltered = await Tree.countDocuments({ $or: [{ note: regex }, { treeType: regex }, { street: regex }] })

        result = {
            recordsTotal: recordsTotal,
            recordsFiltered: recordsFiltered,
            data: trees
        }
    } else {
        let trees = await Tree.find({isActive: true, camera: null}).sort({createdTime: -1})
        result.data = trees
    }
    return responseStatus.Code200(result);
}

module.exports = {
    createTree,
    getDetailTree,
    getListTree
}