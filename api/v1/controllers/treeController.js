const mongoose = require('mongoose')
const Tree = mongoose.model('Tree')
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
    tree.cityId = parseInt(tree.city);
    tree.districtId = parseInt(tree.district);
    tree.wardId = parseInt(tree.ward);
    tree.latitude = parseFloat(tree.latitude);
    tree.longitude = parseFloat(tree.longitude);
    tree.googleMapsUrl = common.createMapsUrl(tree.latitude, tree.longitude)
    let pathImg = await awsServices.uploadImageToS3('treeImage', file.image);
    tree.image = pathImg;
    let _tree = await Tree.create(tree);
    return responseStatus.Code200({message: 'Tạo cây thành công.'});
}

let getDetailTree = async (id) => {
    let tree = await Tree.findOne({_id: id});
    if (!tree) {
        throw responseStatus.Code400({errorMessage: responseStatus.TREE_IS_NOT_FOUND});
    }
    return responseStatus.Code200({tree});
}

module.exports = {
    createTree,
    getDetailTree
}