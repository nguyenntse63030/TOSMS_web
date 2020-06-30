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
    tree.longtitude = parseFloat(tree.longtitude);
    tree.latitude = parseFloat(tree.latitude);
    let pathImg = await awsServices.uploadImageToS3('treeImage', file.image);
    tree.image = pathImg;
    let _tree = await Tree.create(tree);
    return responseStatus.Code200({message: 'Tạo cây thành công.'});
}

module.exports = {
    createTree
}