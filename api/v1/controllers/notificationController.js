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
const serviceAccount = require('../../../tosms-web-firebase-adminsdk-d84ef-668fc23427.json')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: config.DATABASE_FIREBASE
})
const firestore = admin.firestore();
firestore.settings({ timestampsInSnapshots: true })

async function createNotification(data) {
    let camera = await Camera.findById({_id: data.cameraId}).populate('tree');
    if (!camera) {
        throw responseStatus.Code400({errorMessage: 'Camera không tồn tại'});
    }
    data.tree = camera.tree._id;
    let notification = await Notification.create(data)
    if (!notification) {
        throw responseStatus.Code400({ errorMessage: responseStatus.CREATE_NOTIFICATION_FAIL })
    }
    return notification;
}

async function getListNotification(query) {
    let start = parseInt(query.start);
    let length = parseInt(query.length)
    let regex = new RegExp(query.search.value, 'i');
    let notifications = await Notification.find({ $or: [{ name: regex }, { status: regex }] }).skip(start).limit(length).sort({ createdTime: -1 });
    let recordsTotal = await Notification.countDocuments();
    let recordsFiltered = await Notification.countDocuments({ $or: [{ name: regex }, { status: regex }] })
    let result = {
        recordsTotal: recordsTotal,
        recordsFiltered: recordsFiltered,
        data: notifications
    }
    return responseStatus.Code200(result);
}

async function getNotification(id) {
    let notification = await Notification.findOne({ _id: id });
    if (!notification) {
        throw responseStatus.Code400({ errorMessage: responseStatus.NOTIFICATION_IS_NOT_FOUND });
    }
    return responseStatus.Code200({ notification });
}

let sendNotification = async (result) => {
    let notification = {
        title: 'Cảnh Báo Vấn Đề',
        body: result.name,
        icon: result.image,
        link: '/notification/' + result.id,
        readed: false,
        createdTime: admin.firestore.FieldValue.serverTimestamp()
    }
    let userRef = firestore.collection("manager");
    let response = await userRef.add(notification);
    return responseStatus.Code200({ path: response.path })
}

let setNotificationReaded = async () => {
    let snapshot = await firestore.collection('manager').get()
    snapshot.forEach(async (doc) => {
        let docUpdate = firestore.collection('manager').doc(doc.id)
        let result = await docUpdate.update({ readed: true })
    });
    return {result: true}
}

module.exports = {
    createNotification,
    getListNotification,
    getNotification,
    sendNotification,
    setNotificationReaded
}