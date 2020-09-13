const mongoose = require('mongoose')
const Notification = mongoose.model('Notification')
const Camera = mongoose.model('Camera')
const Tree = mongoose.model('Tree')
const User = mongoose.model("User");
const responseStatus = require('../../../configs/responseStatus')
const common = require('../../common')
const jwt = require('jsonwebtoken')
const config = require('../../../config')
const constant = require('../../../configs/constant')
const mailServices = require('../services/mailServices');
const admin = require('firebase-admin');
const serviceAccount = require('../../../tosms-web-b75d4-firebase-adminsdk-784qt-6769504989.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.DATABASE_FIREBASE,
});
const firestore = admin.firestore();
firestore.settings({ timestampsInSnapshots: true });

async function createNotification(data) {
  let camera = await Camera.findById({ _id: data.cameraId }).populate("tree");
  if (!camera) {
    throw responseStatus.Code400({ errorMessage: responseStatus.CAMERA_IS_NOT_FOUND });
  }
  data.tree = camera.tree._id;
  camera.tree.note = constant.priorityStatus.CHUA_XU_LY;
  camera.tree.description = data.name;
  await camera.tree.save();
  let notification = await Notification.create(data);
  if (!notification) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.CREATE_NOTIFICATION_FAIL,
    });
  }
  return notification;
}

async function getListNotification(req) {
  let query = req.query;
  let user = req.session.user
  let regex = new RegExp(query.search.value, "i");
  let sort = optSortNotification(query.order[0]);
  let queryOpt = {
    status: {
      $in: [
        constant.priorityStatus.DANG_XU_LY,
        constant.priorityStatus.CHUA_XU_LY,
      ],
    },
    $or: [{ name: regex }, { status: regex }],
  };
  if (query.queryProblems && !query.queryProblems.includes(constant.ALL)) {
    let filter = []
    query.queryProblems.map((problem) => {
      filter.push({ name: new RegExp(problem, 'i') })
    })

    queryOpt.$or = filter
  }
  let queryCount = {};
  if (req.user.role === constant.userRoles.WORKER) {
    queryOpt = {
      worker: req.user.id,
      status: constant.priorityStatus.DANG_XU_LY,
      $or: [{ name: regex }, { status: regex }],
    };
    queryCount = {
      worker: req.user.id,
      status: constant.priorityStatus.DANG_XU_LY,
    };
  }
  let start = parseInt(query.start);
  let length = parseInt(query.length);
  if (query.find) {
    let findObj = query.find
    let trees
    if (findObj.district && findObj.ward) {
      trees = await Tree.find({ district: query.find.district, ward: query.find.ward }, { _id: 1 })
    } else if (findObj.district) {
      trees = await Tree.find({ district: query.find.district }, { _id: 1 })
    }
    queryOpt.tree = { $in: trees }
  }
  let notifications
  if (user.role === constant.userRoles.MANAGER) {
    notifications = await Notification.find(queryOpt)
      .populate({
        path: 'tree',
        match: { district: user.district },
        select: 'district'
      })
      .skip(start)
      .limit(length)
      .sort(sort);
    notifications = notifications.filter(notification => {
      return notification.tree !== null
    })
  } else {
    notifications = await Notification.find(queryOpt)
      .skip(start)
      .limit(length)
      .sort(sort);
  }
  let recordsTotal = await Notification.countDocuments(queryCount);
  let recordsFiltered = await Notification.countDocuments(queryOpt);
  let result = {
    recordsTotal: recordsTotal,
    recordsFiltered: recordsFiltered,
    data: notifications,
    sort: query.order[0].column !== "0" ? "asc" : query.order[0].dir,
  };
  return responseStatus.Code200(result);
}

async function getListNotificationDone(req) {
  let query = req.query;
  let regex = new RegExp(query.search.value, "i");
  let queryOpt = {
    status: constant.priorityStatus.DA_XU_LY,
    $or: [{ name: regex }, { status: regex }],
  };
  let queryCount = { status: constant.priorityStatus.DA_XU_LY };
  if (req.user.role === constant.userRoles.WORKER) {
    queryOpt = {
      worker: req.user.id,
      status: constant.priorityStatus.DA_XU_LY,
      $or: [{ name: regex }, { status: regex }],
    };
    queryCount = {
      worker: req.user.id,
      status: constant.priorityStatus.DA_XU_LY,
    };
  }
  let start = parseInt(query.start);
  let length = parseInt(query.length);

  let notifications = await Notification.find(queryOpt)
    .skip(start)
    .limit(length)
    .sort({ createdTime: -1 });
  let recordsTotal = await Notification.countDocuments(queryCount);
  let recordsFiltered = await Notification.countDocuments(queryOpt);
  let result = {
    recordsTotal: recordsTotal,
    recordsFiltered: recordsFiltered,
    data: notifications,
  };
  return responseStatus.Code200(result);
}

async function getNotification(req, id) {
  let queryOpt = { _id: id };
  if (req.user.role === constant.userRoles.WORKER) {
    queryOpt = { _id: id, worker: req.user.id };
  }
  let notification = await Notification.findOne(queryOpt)
    .populate("worker")
    .populate('tree', 'code treeType districtName')
  if (!notification) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.NOTIFICATION_IS_NOT_FOUND,
    });
  }
  return responseStatus.Code200({ notification });
}

let sendNotification = async (result, receiver) => {
  let response = {};
  let userRef;
  //bắt điều kiện nếu người nhận là worker thì thêm vào userId để phân loại noti 
  //của người đó tránh việc mất thông báo
  if (receiver === constant.notiCollection.WORKER) {
    //vòng lặp gan
    let batch = firestore.batch();
    result.worker.forEach((worker) => {
      let notification = {
        title: config.NOTI_CONFIG.title,
        body: result.name,
        icon: result.image,
        link: config.NOTI_CONFIG.link + result.id,
        readed: false,
        readAdmin: false,
        createdTime: admin.firestore.FieldValue.serverTimestamp()
      };
      workerId = worker._id.toString();
      notification.userId = workerId;
      userRef = firestore.collection(receiver).doc();
      batch.set(userRef, notification);
    })
    response = await batch.commit()
  } else {
    let notification = {
      title: config.NOTI_CONFIG.title,
      body: result.name,
      icon: result.image,
      link: config.NOTI_CONFIG.link + result.id,
      readed: false,
      readAdmin: false,
      createdTime: admin.firestore.FieldValue.serverTimestamp()
    };
    //nêu người nhận là manager và admin thì 
    //thêm quận vào manager đó để phân loại notification theo quận
    let tree = await Tree.findOne({ _id: result.tree });
    notification.district = tree.district.toString();
    userRef = firestore.collection(receiver);
    response = userRef.add(notification);
  }
  return;
};

let setNotificationReaded = async (req) => {
  let collection = constant.notiCollection.MANAGER;
  let optUpdate = { readed: true };
  if (req.user.role === constant.userRoles.WORKER) {
    collection = constant.notiCollection.WORKER;
    snapshot = await firestore.collection(collection).where('userId', '==', req.user.id).get();
  } else if (req.user.role === constant.userRoles.MANAGER) {
    snapshot = await firestore.collection(collection).where('district', '==', req.user.district).get();
  } else {
    snapshot = await firestore.collection(collection).get()
    optUpdate = { readAdmin: true }
  }
  snapshot.forEach(async (doc) => {
    let docUpdate = firestore.collection(collection).doc(doc.id);
    let result = await docUpdate.update(optUpdate);
  });
  return { result: true };
};

let setWorkerToNoti = async (req) => {
  let id = req.params.id;
  let workerIdArr = req.body.workerId;
  let result = await checkUserExist(workerIdArr);
  let queryOpt = { _id: id };

  let notification = await Notification.findOne(queryOpt).populate("tree");
  if (!notification) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.NOTIFICATION_IS_NOT_FOUND,
    });
  }
  notification.tree.note = constant.priorityStatus.DANG_XU_LY;
  notification.status = constant.priorityStatus.DANG_XU_LY;
  notification.worker = workerIdArr;
  notification.modifiedTime = Date.now();
  let _notification = await notification.save();
  await notification.tree.save();
  mailServices.sendMailToWorker(result, notification);
  sendNotification(_notification, constant.notiCollection.WORKER);
  return responseStatus.Code200({
    notification: _notification,
    message: responseStatus.SET_WORKER_TO_NOTI_SUCCESS,
  });
};

let checkUserExist = async (workerIdArr) => {
  let worker = {};
  let promise = workerIdArr.map(async (workerId) => {
    let id = workerId;
    worker = await User.findOne({ _id: id, isActive: true, role: constant.userRoles.WORKER}, {email: 1});
    if (!worker) {
      throw responseStatus.Code400({ errorMessage: responseStatus.USER_IS_NOT_FOUND });
    } else {
      return worker
    }
  })
  return await Promise.all(promise);
}

let setStatusNotiSuccess = async (req) => {
  let id = req.params.id;
  // let notification = await Notification.findOne({ _id: id, worker: req.user.id }).populate('tree');
  let notification = await Notification.findOne({ _id: id }).populate("tree");
  if (!notification) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.NOTIFICATION_IS_NOT_FOUND,
    });
  }

  if (notification.status != constant.priorityStatus.DANG_XU_LY) {
    throw responseStatus.Code400({
      errorMessage: responseStatus.ERRO_SET_NOTI_STATUS,
    });
  }

  notification.status = constant.priorityStatus.DA_XU_LY;
  let _notification = await notification.save();

  // noti đang xử lý của cây
  let notiProcessing = await Notification.findOne({
    tree: notification.tree,
    status: constant.priorityStatus.DANG_XU_LY,
  }).sort({ createdTime: 1 });
  if (notiProcessing) {
    notification.tree.note = notiProcessing.status;
    notification.tree.description = notiProcessing.name;
  } else {
    // noti chưa xử lý của cây
    let notiUnprocess = await Notification.findOne({
      tree: notification.tree,
      status: constant.priorityStatus.CHUA_XU_LY,
    }).sort({ createdTime: 1 });
    if (notiUnprocess) {
      notification.tree.note = notiUnprocess.status;
      notification.tree.description = notiUnprocess.name;
    } else {
      notification.tree.note = constant.treeProblemDisplay.NO_PROBLEM;
      notification.tree.description = constant.TREE_NOT_DESCRIPTION;
    }
  }
  await notification.tree.save();


  return responseStatus.Code200({
    notification: _notification,
    message: responseStatus.SET_NOTI_STATUS_SUCCESS,
  });
};
let optSortNotification = (sortOpt) => {
  let sort = {};
  switch (sortOpt.column) {
    case "0":
      sort = { createdTime: sortOpt.dir };
      break;
    case "1":
      sort = { name: sortOpt.dir };
      break;
    case "2":
      sort = { status: sortOpt.dir };
      break;
    case "3":
      sort = { modifiedTime: sortOpt.dir };
      break;
  }
  return sort;
};
module.exports = {
  createNotification,
  getListNotification,
  getNotification,
  sendNotification,
  setNotificationReaded,
  setWorkerToNoti,
  setStatusNotiSuccess,
  getListNotificationDone,
};
