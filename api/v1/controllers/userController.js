const mongoose = require("mongoose");
const User = mongoose.model("User");
const responseStatus = require("../../../configs/responseStatus");
const common = require("../../common");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const config = require("../../../config");
const constant = require("../../../configs/constant");
const mssql = require("mssql");

async function getListUser(query) {
  let start = parseInt(query.start);
  let length = parseInt(query.length);
  let regex = new RegExp(query.search.value, "i");
  let users = await User.find({ $or: [{ name: regex }, { status: regex }] })
    .skip(start)
    .limit(length)
    .sort({ createdTime: -1 });
  let recordsTotal = await User.countDocuments();
  let recordsFiltered = await User.countDocuments({
    $or: [{ name: regex }, { status: regex }],
  });
  let result = {
    recordsTotal: recordsTotal,
    recordsFiltered: recordsFiltered,
    data: users,
  };
  return responseStatus.Code200(result);
}
async function getUser(id) {
  let user = await User.findOne({ _id: id }, { password: 0 }).populate(
    "district"
  );
  if (!user) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.USER_IS_NOT_FOUND,
    });
  }
  return responseStatus.Code200({ user });
}
let createUser = async (data, file) => {
  let user = data;
  // let user = await User.findById({ _id: camera.tree }).populate("camera");

  await validateDataUser(user, file);
  let regex = new RegExp(user.username, "i");
  let checkExist = await User.findOne({ username: regex });

  if (checkExist) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.USERNAME_IS_CANT_DUPLICATE,
    });
  }

  let pathImg = await awsServices.uploadImageToS3("userImg", file.image);
  user.avata = pathImg;

  let result = await User.create(user);
  if (!result) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.USER_CREATE_FAIL,
    });
  }

  // tree.camera = result._id;
  // tree.save();
  return responseStatus.Code200({
    message: responseStatus.USER_CREATE_SUCCESS,
  });
};
let deleteUser = async (id) => {
  let user = await User.findOne({ _id: id, isActive: true });
  if (!user) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.USER_IS_NOT_FOUND,
    });
  }
  user.isActive = false;
  let _user = await user.save();
  if (_user !== user) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.DELETE_USER_FAIL,
    });
  }
  return responseStatus.Code200({
    message: responseStatus.DELETE_USER_SUCCESS,
  });
};

let updateUser = async (id, data) => {
  let user = await User.findOne({ _id: id, isActive: true });
  if (!user) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.USER_IS_NOT_FOUND,
    });
  }
  (user.name = data.name || user.name),
    (user.gender = data.gender || user.gender),
    (user.role = data.role || user.role),
    (user.birthday = data.birthday || user.birthday),
    (user.email = data.email || user.email),
    (user.role = data.role || user.role),
    (user.address = data.address || user.address);
  let _user = await user.save();
  if (_user !== user) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.UPDATE_USER_FAIL,
    });
  }
  return responseStatus.Code200({
    message: responseStatus.UPDATE_USER_SUCCESS,
    user: _user,
  });
};
let uploadImage = async (id, file) => {
  let user = await User.findOne({ _id: id, isActive: true });
  if (!user) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.USER_IS_NOT_FOUND,
    });
  }
  let pathImg = await awsServices.uploadImageToS3("employeeAvata", file.image);
  user.avata = pathImg || user.avata;
  let _user = await user.save();
  if (_user !== user) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.USER_UPLOAD_IMAGE_FAIL,
    });
  }
  return responseStatus.Code200({
    message: responseStatus.USER_UPLOAD_IMAGE_SUCCESS,
    user: _user,
  });
};

module.exports = {
  getListUser,
  getUser,
  uploadImage,
  createUser,
  deleteUser,
  updateUser,
};
