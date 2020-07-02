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

module.exports = {
  getListUser,
  getUser,
};
