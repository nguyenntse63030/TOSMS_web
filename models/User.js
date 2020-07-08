const mongoose = require("mongoose");
const crypto = require("crypto-js");
const constants = require("../configs/constant");
var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    default: constants.gender.Male,
    enum: constants.genderEnums,
  },
  birthday: {
    type: Number,
    default: 0,
  },
  address: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    default: constants.userRoles.WORKER,
    enum: constants.userRolesEnums,
  },
  avatar: {
    type: String,
    default: "",
  },
  district: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "District",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  modifiedTime: {
    type: Number,
    default: Date.now,
  },
  createdTime: {
    type: Number,
    default: Date.now,
  },
});

UserSchema.methods.authenticate = function (password) {
  try {
    var bytes = crypto.AES.decrypt(this.password, this.username);
    var decryptPass = bytes.toString(crypto.enc.Utf8);
    return password === decryptPass;
  } catch (error) {
    console.log(error);
  }
};

UserSchema.methods.hashPassword = function (password) {
  return crypto.AES.encrypt(password, this.username).toString();
};

UserSchema.pre('save', async function () {
  let password = await this.hashPassword(this.password);
  this.password = password
}) 
mongoose.model("User", UserSchema);
