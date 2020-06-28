const common = require('../../common');
const responseStatus = require('../../../configs/responseStatus');
const sql = require('../services/sqlSevices');
const constant = require('../../../configs/constant');
const mssql = require('mssql');
const request = require('request');
const config = require('../../../config');
const { JsonWebTokenError } = require('jsonwebtoken');
const { post } = require('../route/python');    
const admin = require('firebase-admin');
const serviceAccount = require('../../../tosms-web-firebase-adminsdk-d84ef-668fc23427.json')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: config.DATABASE_FIREBASE
})
const firestore = admin.firestore();
firestore.settings({ timestampsInSnapshots: true })

let sendNotification = async (result) => {
    let notification = {
        title: 'Cảnh Báo Vấn Đề',
        body: result.result,
        icon: 'https://cdn5.vectorstock.com/i/1000x1000/01/94/touch-screen-finger-hand-press-push-icon-vector-20720194.jpg',
        link: '/notification/' + result.notificationId,
        readed: false
    }
    let userRef = firestore.collection("userTest");
    let response = await userRef.add(notification);
    return response
}

// let getNotification = async () => {
//     let response = await 
// }

module.exports = {
    sendNotification
}