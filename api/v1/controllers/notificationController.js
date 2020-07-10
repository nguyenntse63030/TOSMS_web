const mongoose = require('mongoose')
const Notification = mongoose.model('Notification')
const Camera = mongoose.model('Camera')
const Tree = mongoose.model('Tree')
const responseStatus = require('../../../configs/responseStatus')
const common = require('../../common')
const jwt = require('jsonwebtoken')
const config = require('../../../config')
const constant = require('../../../configs/constant')
const admin = require('firebase-admin');
const serviceAccount = require('../../../tosms-web-firebase-adminsdk-d84ef-9e95c65ffb.json')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: config.DATABASE_FIREBASE
})
const firestore = admin.firestore();
firestore.settings({ timestampsInSnapshots: true })

async function createNotification(data) {
    let camera = await Camera.findById({ _id: data.cameraId }).populate('tree');
    if (!camera) {
        throw responseStatus.Code400({ errorMessage: 'Camera không tồn tại' });
    }
    data.tree = camera.tree._id;
    camera.tree.note = constant.priorityStatus.CHUA_XU_LY;
    camera.tree.description = data.name
    await camera.tree.save();
    let notification = await Notification.create(data)
    if (!notification) {
        throw responseStatus.Code400({ errorMessage: responseStatus.CREATE_NOTIFICATION_FAIL })
    }
    return notification;
}

async function getListNotification(req) {
    let query = req.query;
    let regex = new RegExp(query.search.value, 'i');
    let queryOpt = { status: { $in: [constant.priorityStatus.DANG_XU_LY, constant.priorityStatus.CHUA_XU_LY] }, $or: [{ name: regex }, { status: regex }] }
    let queryCount = {}
    if (req.user.role === constant.userRoles.WORKER) {
        queryOpt = { worker: req.user.id, status: constant.priorityStatus.DANG_XU_LY, $or: [{ name: regex }, { status: regex }] }
        queryCount = { worker: req.user.id, status: constant.priorityStatus.DANG_XU_LY }
    }
    let start = parseInt(query.start);
    let length = parseInt(query.length);

    let notifications = await Notification.find(queryOpt).skip(start).limit(length).sort({ createdTime: -1 });
    let recordsTotal = await Notification.countDocuments(queryCount);
    let recordsFiltered = await Notification.countDocuments(queryOpt);
    let result = {
        recordsTotal: recordsTotal,
        recordsFiltered: recordsFiltered,
        data: notifications
    }
    return responseStatus.Code200(result);
}

async function getListNotificationDone(req) {
    let query = req.query;
    let regex = new RegExp(query.search.value, 'i');
    let queryOpt = { status: constant.priorityStatus.DA_XU_LY, $or: [{ name: regex }, { status: regex }] }
    let queryCount = { status: constant.priorityStatus.DA_XU_LY }
    if (req.user.role === constant.userRoles.WORKER) {
        queryOpt = { worker: req.user.id, status: constant.priorityStatus.DA_XU_LY, $or: [{ name: regex }, { status: regex }] }
        queryCount = { worker: req.user.id, status: constant.priorityStatus.DA_XU_LY }
    }
    let start = parseInt(query.start);
    let length = parseInt(query.length);

    let notifications = await Notification.find(queryOpt).skip(start).limit(length).sort({ createdTime: -1 });
    let recordsTotal = await Notification.countDocuments(queryCount);
    let recordsFiltered = await Notification.countDocuments(queryOpt);
    let result = {
        recordsTotal: recordsTotal,
        recordsFiltered: recordsFiltered,
        data: notifications
    }
    return responseStatus.Code200(result);
}

async function getNotification(req, id) {
    let queryOpt = { _id: id }
    if (req.user.role === constant.userRoles.WORKER) {
        queryOpt = { _id: id, worker: req.user.id }
    }
    let notification = await Notification.findOne(queryOpt).populate('worker');
    if (!notification) {
        throw responseStatus.Code400({ errorMessage: responseStatus.NOTIFICATION_IS_NOT_FOUND });
    }
    return responseStatus.Code200({ notification });
}

let sendNotification = (result) => {
    let notification = {
        title: 'Cảnh Báo Vấn Đề',
        body: result.name,
        icon: result.image,
        link: '/notification/' + result.id,
        readed: false,
        createdTime: admin.firestore.FieldValue.serverTimestamp()
    }
    let userRef = firestore.collection("manager");
    let response = userRef.add(notification);
    return;
}

let setNotificationReaded = async() => {
    let snapshot = await firestore.collection('manager').get()
    snapshot.forEach(async(doc) => {
        let docUpdate = firestore.collection('manager').doc(doc.id)
        let result = await docUpdate.update({ readed: true })
    });
    return { result: true }
}

let setWorkerToNoti = async(req) => {
    let id = req.params.id;
    let workerId = req.body.workerId;
    let queryOpt = { _id: id }
    let notification = await Notification.findOne(queryOpt).populate('tree');
    if (!notification) {
        throw responseStatus.Code400({ errorMessage: responseStatus.NOTIFICATION_IS_NOT_FOUND });
    }
    notification.tree.note = constant.priorityStatus.DANG_XU_LY;
    notification.status = constant.priorityStatus.DANG_XU_LY;
    notification.worker = workerId;
    let _notification = await notification.save();
    await notification.tree.save()

    return responseStatus.Code200({ notification: _notification, message: responseStatus.SET_WORKER_TO_NOTI_SUCCESS });
}

let setStatusNotiSuccess = async(req) => {
    let id = req.params.id;
    // let notification = await Notification.findOne({ _id: id, worker: req.user.id }).populate('tree');
    let notification = await Notification.findOne({ _id: id }).populate('tree');
    if (!notification) {
        throw responseStatus.Code400({ errorMessage: responseStatus.NOTIFICATION_IS_NOT_FOUND });
    }

    if (notification.status != constant.priorityStatus.DANG_XU_LY) {
        throw responseStatus.Code400({ errorMessage: responseStatus.ERRO_SET_NOTI_STATUS });
    }

    // noti chưa xử lý của cây
    let noti = await Notification.findOne({ tree: notification.tree, status: constant.priorityStatus.CHUA_XU_LY }).sort({createdTime: 1})
    if (!noti) {
        notification.tree.note = constant.treeProblemDisplay.NO_PROBLEM;
        notification.tree.description = constant.TREE_NOT_DESCRIPTION;
    } else {
        notification.tree.note = noti.status
        notification.tree.description = noti.name
    }
    await notification.tree.save()

    notification.status = constant.priorityStatus.DA_XU_LY;
    let _notification = await notification.save();
    return responseStatus.Code200({ notification: _notification, message: responseStatus.SET_NOTI_STATUS_SUCCESS })
}
module.exports = {
    createNotification,
    getListNotification,
    getNotification,
    sendNotification,
    setNotificationReaded,
    setWorkerToNoti,
    setStatusNotiSuccess,
    getListNotificationDone
}