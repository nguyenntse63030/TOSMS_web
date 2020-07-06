const mongoose = require("mongoose");
const Camera = mongoose.model("Camera");
const Tree = mongoose.model("Tree");
const awsServices = require("../services/awsServices");
const { response } = require("express");
const responseStatus = require("../../../configs/responseStatus");

let getListCamera = async (query) => {
  let result = {};
  if (query.start && query.length) {
    let start = parseInt(query.start);
    let length = parseInt(query.length);
    let regex = new RegExp(query.search.value, "i");
    let cameras = await Camera.find({ $and: [{
      $or: [{ code: regex }, { status: regex }],
    }, {isActive: true}]})
      .skip(start)
      .limit(length)
      .sort({ createdTime: -1 });
    let recordsTotal = await Camera.countDocuments({isActive: true});
    let recordsFiltered = await Camera.countDocuments({ $and: [{
      $or: [{ code: regex }, { status: regex }],
    }, {isActive: true}]});
    result = {
      recordsTotal: recordsTotal,
      recordsFiltered: recordsFiltered,
      data: cameras,
    };
  } else {
    let cameras = await Camera.find({isActive: true}).sort({ createdTime: -1 });
    result.data = cameras;
  }
  return responseStatus.Code200(result);
};
let getDetailCamera = async (id) => {
  let poputlateOpt = { path: 'tree', match: { isActive: true } }
  let camera = await Camera.findOne({ _id: id, isActive: true }).populate(poputlateOpt);
  if (!camera) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.CAMERA_IS_NOT_FOUND,
    });
  }
  return responseStatus.Code200({ camera });
};

let createCamera = async (data, file) => {
  let camera = data;
  let tree = await Tree.findById({ _id: camera.tree }).populate("camera");

  await validateDataCamera(camera, tree, file);
  let regex = new RegExp(camera.code, "i");
  let checkExist = await Camera.findOne({ code: regex });

  if (checkExist) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.CAMERA_CODE_IS_CANT_DUPLICATE,
    });
  }

  let pathImg = await awsServices.uploadImageToS3("cameraImg", file.image);
  camera.image = pathImg;

  let result = await Camera.create(camera);
  if (!result) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.CAMERA_CREATE_FAIL,
    });
  }

  tree.camera = result._id;
  tree.save();
  return responseStatus.Code200({
    message: responseStatus.CAMERA_CREATE_SUCCESS,
  });
};
let deleteCamera = async (id) => {
  let camera = await Camera.findOne({ _id: id, isActive: true });
  if (!camera) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.CAMERA_IS_NOT_FOUND,
    });
  }
  camera.isActive = false;
  let _camera = await camera.save();
  if (_camera !== camera) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.DELETE_CAMERA_FAIL,
    });
  }
  return responseStatus.Code200({
    message: responseStatus.DELETE_CAMERA_SUCCESS,
  });
};
let updateCamera = async (id, data) => {
  let camera = await Camera.findOne({ _id: id, isActive: true });
  if (!camera) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.CAMERA_IS_NOT_FOUND,
    });
  }
  (camera.cameraType = data.cameraType || camera.cameraType),
    (camera.status = data.status || camera.status),
    (camera.ipAddress = data.ipAddress || camera.ipAddress),
    (camera.modifiedTime = Date.now());
  let _camera = await camera.save();
  if (_camera !== camera) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.UPDATE_CAMERA_FAIL,
    });
  }
  return responseStatus.Code200({
    message: responseStatus.UPDATE_CAMERA_SUCCESS,
    camera: _camera,
  });
};

let validateDataCamera = (camera, tree, file) => {
  if (!camera.code) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.CAMERA_CODE_IS_CANT_EMPTY,
    });
  }

  if (!camera.ipAddress) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.CAMERA_IP__IS_CANT_EMPTY,
    });
  }

  if (!file) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.CAMERA_IMAGE__IS_CANT_EMPTY,
    });
  }

  if (camera.tree) {
    if (!tree) {
      throw responseStatus.Code400({
        errorMessage: responseStatus.TREE_IS_NOT_FOUND,
      });
    }
    if (tree.camera) {
      throw responseStatus.Code400({
        errorMessage: responseStatus.TREE_ONLY_HAVE_ONE_CAMERA,
      });
    }
  }
};
let uploadImage = async (id, file) => {
  let camera = await Camera.findOne({ _id: id, isActive: true });
  if (!camera) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.CAMERA_IS_NOT_FOUND,
    });
  }
  let pathImg = await awsServices.uploadImageToS3("cameraImg", file.image);
  camera.image = pathImg || camera.image;
  let _camera = await camera.save();
  if (_camera !== camera) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.CAMERA_UPLOAD_IMAGE_FAIL,
    });
  }
  return responseStatus.Code200({
    message: responseStatus.CAMERA_UPLOAD_IMAGE_SUCCESS,
    camera: _camera,
  });
};
module.exports = {
  getListCamera,
  createCamera,
  getDetailCamera,
  deleteCamera,
  updateCamera,
  uploadImage
};
