const mongoose = require("mongoose");
const Camera = mongoose.model("Camera");
const Tree = mongoose.model("Tree");
const awsServices = require("../services/awsServices");
const responseStatus = require("../../../configs/responseStatus");
const RTSPStream = require("node-rtsp-stream");
let WebSocketServer = require("ws").Server;

let getListCamera = async (query) => {
  let result = {};
  if (query.start && query.length) {
    let start = parseInt(query.start);
    let length = parseInt(query.length);
    let regex = new RegExp(query.search.value, "i");
    let sort = optSortCamera(query.order[0]);
    let cameras = await Camera.find({
      $and: [
        {
          $or: [{ code: regex }, { status: regex }],
        },
        { isActive: true },
      ],
    })
      .skip(start)
      .limit(length)
      .sort(sort);
    let recordsTotal = await Camera.countDocuments({ isActive: true });
    let recordsFiltered = await Camera.countDocuments({
      $and: [
        {
          $or: [{ code: regex }, { status: regex }],
        },
        { isActive: true },
      ],
    });
    result = {
      recordsTotal: recordsTotal,
      recordsFiltered: recordsFiltered,
      data: cameras,
      sort: query.order[0].column !== "0" ? "asc" : query.order[0].dir,
    };
  } else {
    let cameras = await Camera.find({ isActive: true }).sort({
      createdTime: -1,
    });
    result.data = cameras;
  }
  return responseStatus.Code200(result);
};

let getDetailCamera = async (id) => {
  let poputlateOpt = { path: "tree", match: { isActive: true } };
  let camera = await Camera.findOne({ _id: id, isActive: true }).populate(
    poputlateOpt
  );
  if (!camera) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.CAMERA_IS_NOT_FOUND,
    });
  }
  return responseStatus.Code200({ camera });
};

let createCamera = async (data, file) => {
  let camera = data;
  let tree = await Tree.findOne({ _id: camera.tree }).populate("camera");

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

  if (tree) {
    tree.camera = result._id;
    tree.save();
  }
  return responseStatus.Code200({
    message: responseStatus.CAMERA_CREATE_SUCCESS,
  });
};

let deleteCamera = async (id) => {
  let camera = await Camera.findOne({ _id: id, isActive: true }).populate(
    "tree"
  );
  if (!camera) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.CAMERA_IS_NOT_FOUND,
    });
  }
  let tree = camera.tree;
  camera.isActive = false;
  camera.tree = undefined;
  let _camera = await camera.save();
  if (_camera !== camera) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.DELETE_CAMERA_FAIL,
    });
  }
  tree.camera = undefined;
  await tree.save();
  return responseStatus.Code200({
    message: responseStatus.DELETE_CAMERA_SUCCESS,
  });
};

async function updateCamera(id, data) {
  let camera = await Camera.findOne({ _id: id, isActive: true })
  if (!camera) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.CAMERA_IS_NOT_FOUND,
    });
  }
  // let tree = await Tree.findOne({ _id: camera.tree });
  // let tree = await Tree.findOne({ _id: camera.tree }).populate("camera");
  camera.cameraType = data.cameraType || camera.cameraType;
  camera.status = data.status || camera.status;
  camera.ipAddress = data.ipAddress || camera.ipAddress;
  camera.modifiedTime = Date.now();
  if (data.tree) {
    let oldTree = await Tree.findById(camera.tree)
    if (!oldTree) {
      throw responseStatus.Code400({errorMessage: responseStatus.TREE_IS_NOT_FOUND})
    }

    let newTree = await Tree.findById(data.tree)
    if (!newTree) {
      throw responseStatus.Code400({errorMessage: responseStatus.TREE_IS_NOT_FOUND})
    }

    oldTree.camera = undefined;
    await oldTree.save()

    newTree.camera = camera._id
    await newTree.save();
    camera.tree = newTree._id
  }
  let _camera = await camera.save();

  return responseStatus.Code200({
    message: responseStatus.UPDATE_CAMERA_SUCCESS,
    camera: _camera,
  });
};

// let updateCamera = async (id, data) => {
//   let camera = await Camera.findOne({ _id: id, isActive: true });

//   if (!camera) {
//     throw responseStatus.Code400({
//       errorMessage: responseStatus.CAMERA_IS_NOT_FOUND,
//     });
//   }
//   let tree = await Tree.findOne({ _id: camera.tree });
//   // let tree = await Tree.findById({ _id: camera.tree });
//   // let tree = await Tree.findOne({ _id: camera.tree }).populate("camera");
//   camera.cameraType = data.cameraType || camera.cameraType;
//   camera.status = data.status || camera.status;
//   camera.ipAddress = data.ipAddress || camera.ipAddress;
//   camera.tree = data.tree || camera.tree;
//   camera.code = data.code;
//   camera.modifiedTime = Date.now();
//   let _camera = await camera.save();
//   if (tree) {
//     tree.camera = _camera._id;
//     tree.save();
//   }

//   return responseStatus.Code200({
//     message: responseStatus.UPDATE_CAMERA_SUCCESS,
//     camera: _camera,
//   });
// };

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

async function getCameraStream(cameraID) {
  let camera = await Camera.findById(cameraID);
  if (!camera) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.CAMERA_IS_NOT_FOUND,
    });
  }
  // let url = "rtsp://admin:123456@" + camera.ipAddress.trim()
  let player = new RTSPStream({
    name: camera.code,
    streamUrl: camera.ipAddress.trim(),
    width: 1400,
    height: 800,
    // wsPort: 9999,
    ffmpegOptions: {
      // options ffmpeg flags
      "-stats": "", // an option with no neccessary value uses a blank string
      "-r": 30, // options with required values specify the value after the key
    },
  });
  console.log(player);
  return responseStatus.Code200({ port: player.wsPort });
}

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
let optSortCamera = (sortOpt) => {
  let sort = {};
  switch (sortOpt.column) {
    case "0":
      sort = { createdTime: sortOpt.dir };
    case "1":
      sort = { code: sortOpt.dir };

    case "2":
      sort = { ipAddress: sortOpt.dir };
    case "3":
      sort = { status: sortOpt.dir };
    case "4":
      sort = { createdTime: sortOpt.dir };

      break;
  }
  return sort;
};

module.exports = {
  getListCamera,
  createCamera,
  getDetailCamera,
  deleteCamera,
  updateCamera,
  getCameraStream,
  uploadImage,
};
