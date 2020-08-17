const mongoose = require("mongoose");
const User = mongoose.model("User");
const District = mongoose.model("District");
const responseStatus = require("../../../configs/responseStatus");
const common = require("../../common");
const config = require("../../../config");
const constant = require("../../../configs/constant");
const awsServices = require("../services/awsServices");

async function getListUser(req, query) {
  let start = parseInt(query.start);
  let length = parseInt(query.length);
  let regex = new RegExp(query.search.value, "i");
  let sort = optSortUser(query.order[0]);
  let queryOpt = {};
  let queryTotal = {};
  if (req.user.role === constant.userRoles.ADMIN) {
    queryOpt = {
      $and: [
        { $or: [{ name: regex }, { status: regex }] },
        { role: { $ne: "admin" } },
        { isActive: true },
      ],
    };
    queryTotal = { role: { $ne: "admin" }, isActive: true };
  } else {
    queryOpt = {
      $and: [
        { $or: [{ name: regex }, { status: regex }] },
        { role: { $nin: ["admin", "manager"] } },
        { isActive: true },
      ],
    };
    queryTotal = { role: { $nin: ["admin", "manager"] }, isActive: true };
  }
  if (query.find) {
    queryOpt = Object.assign({}, queryOpt, query.find);
  }
  let users = await User.find(queryOpt).skip(start).limit(length).sort(sort);
  let recordsTotal = await User.countDocuments(queryTotal);
  let recordsFiltered = await User.countDocuments(queryOpt);
  let result = {
    recordsTotal: recordsTotal,
    recordsFiltered: recordsFiltered,
    data: users,
    sort: query.order[0].column !== "0" ? "asc" : query.order[0].dir,
  };
  return responseStatus.Code200(result);
}

async function getUser(req, id) {
  let queryOpt = checkRoleGenerateQuery(req.user, id);
  let user = await User.findOne(queryOpt, { password: 0 }).populate("district");
  if (!user) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.USER_IS_NOT_FOUND,
    });
  }

  if (user.role === req.user.role) {
    if (user.id !== req.user.id) {
      throw responseStatus.Code400({
        errorMessage: responseStatus.INVALID_REQUEST,
      });
    }
  }

  return responseStatus.Code200({ user });
}

async function getListWorker() {
  let queryOpt = { role: constant.userRoles.WORKER, isActive: true };
  let users = await User.find(queryOpt).populate('district', 'name');
  return responseStatus.Code200({ users });
}

let createUser = async (req, data, file) => {
  if (req.user.role === constant.userRoles.MANAGER) {
    data.role = constant.userRoles.WORKER;
  }
  data.birthday = parseInt(data.birthday);
  let user = data;
  let district = await District.findById({ _id: data.district });
  if (!district) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.LOCATION_WRONG,
    });
  }
  // await validateDataUser(user, file);
  let regex = new RegExp(user.username, "i");
  let checkExist = await User.findOne({ username: regex });

  if (checkExist) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.USERNAME_IS_CANT_DUPLICATE,
    });
  }
  // user.district = user.district;
  // user.districtName = district.name;

  let pathImg = await awsServices.uploadImageToS3("employeeAvata", file.avatar);
  user.avatar = pathImg;
  let result = await User.create(user);
  if (!result) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.USER_CREATE_FAIL,
    });
  }
  return responseStatus.Code200({
    message: responseStatus.USER_CREATE_SUCCESS,
  });
};
// let validateDataUser = (user, file) => {
//   // if (!user.role) {
//   //   throw responseStatus.Code400({
//   //     errorMessage: responseStatus.USER_ROLE_IS_CANT_EMPTY,
//   //   });
//   // }

//   if (!file) {
//     throw responseStatus.Code400({
//       errorMessage: responseStatus.USER_IMAGE_IS_CANT_EMPTY,
//     });
//   }
//   if (!user.fullname) {
//     throw responseStatus.Code400({
//       errorMessage: responseStatus.USER_FULLNAME_IS_CANT_EMPTY,
//     });
//   }

//   if (!user.username) {
//     throw responseStatus.Code400({
//       errorMessage: responseStatus.USER_USERNAME_IS_CANT_EMPTY,
//     });
//   }

//   if (!user.password) {
//     throw responseStatus.Code400({
//       errorMessage: responseStatus.USER_PASSWORD_IS_CANT_EMPTY,
//     });
//   }
// };

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

let updateUser = async (req, id, data) => {
  let queryOpt = checkRoleGenerateQuery(req.user, id);
  let user = await User.findOne(queryOpt, { password: 0 });
  if (!user) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.USER_IS_NOT_FOUND,
    });
  }

  //mục đích để kiểm tra update profile của bản thân hay là người khác
  if (user.role === req.user.role) {
    if (user.id !== req.user.id) {
      //nếu cùng role nhưng khác tài khoản thì không cho update
      //ví dụ cả 2 role là manager nhưng id khác nhau thì không được update vì không có quyền
      throw responseStatus.Code400({
        errorMessage: responseStatus.INVALID_REQUEST,
      });
    }
  }
  if (req.user.role === constant.userRoles.ADMIN) {
    //kiểm tra nêu role là admin thì cho phép update role nêu không phải vẫn update nhưng ko đổi role
    user.role = data.role || user.role;
    user.district = data.district._id || user.district._id;
  }
  user.name = data.name || user.name;
  user.gender = data.gender || user.gender;
  user.birthday = data.birthday || user.birthday;
  user.email = data.email || user.email;
  user.address = data.address || user.address;
  
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

let uploadImage = async (req, id, file) => {
  let queryOpt = checkRoleGenerateQuery(req.user, id);
  let user = await User.findOne(queryOpt, { password: 0 });
  if (!user) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.USER_IS_NOT_FOUND,
    });
  }

  //mục đích để kiểm tra update profile của bản thân hay là người khác
  if (user.role === req.user.role) {
    if (user.id !== req.user.id) {
      //nếu cùng role nhưng khác tài khoản thì không cho update
      //ví dụ cả 2 role là manager nhưng id khác nhau thì không được update vì không có quyền
      throw responseStatus.Code400({
        errorMessage: responseStatus.INVALID_REQUEST,
      });
    }
  }
  let pathImg = await awsServices.uploadImageToS3("employeeAvata", file.image);
  user.avatar = pathImg || user.avatar;
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

function checkRoleGenerateQuery(user, id) {
  if (user.role === constant.userRoles.WORKER) {
    return { _id: user.id, isActive: true };
  } else {
    return {
      $and: [{ _id: id }, { role: { $ne: "admin" } }, { isActive: true }],
    };
  }
}
let optSortUser = (sortOpt) => {
  let sort = {};
  switch (sortOpt.column) {
    case "0":
      sort = { createdTime: sortOpt.dir };
      break;
    case "1":
      sort = { name: sortOpt.dir };
      break;
    case "2":
      sort = { role: sortOpt.dir };
      break;
    case "3":
      sort = { address: sortOpt.dir };
      break;
    case "4":
      sort = { createdTime: sortOpt.dir };
      break;
  }
  return sort;
};

module.exports = {
  getListUser,
  getUser,
  uploadImage,
  createUser,
  deleteUser,
  updateUser,
  getListWorker,
};
