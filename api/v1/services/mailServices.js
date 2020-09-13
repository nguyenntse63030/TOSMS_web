const mongoose = require("mongoose");
const User = mongoose.model("User");
const Tree = mongoose.model("Tree");
const nodemailer = require('nodemailer');
const config = require("../../../config");
const constant = require("../../../configs/constant");
const fs = require('fs').promises;
const path = require('path')
var filePath = path.join(__dirname, '../../../views/teamplate/email_notification.html')

async function sendMailToManager(notification) {
    let transporter = await nodemailer.createTransport(config.MAIL_TRANSPORTER)
    transporter.verify(async function (err, success) {
        if (err) {
            console.log(err);
        } else {
            let tree = await Tree.findOne({ _id: notification.tree });
            let queryConfig = {role: constant.userRoles.MANAGER, district: tree.district, isActive: true};
            let result = await Promise.all([getListEmailForSend(queryConfig), readTeamplate(), User.findOne({role: constant.userRoles.ADMIN})]);
            let teamplate = result[1];
            let admin = result[2];
            teamplate = teamplate.replace(/TREECODE/g, tree.code);
            teamplate = teamplate.replace(/DISTRICT/g, tree.districtName);
            teamplate = teamplate.replace(/TREEPROBLEMS/g, tree.description);
            teamplate = teamplate.replace(/LINK_DETAIL/g, process.env.LINK_NOTI_DETAIL + notification._id);
            teamplate = teamplate.replace(/LINK_IMAGE_DETECTED/g, notification.imageDetected);
            let emailOption = {
                from: config.MAIL_OPTION.FROM,
                to: '',
                cc: admin.email,
                subject: config.MAIL_OPTION.SUBJECT,
                html: teamplate
            }
            let arrayErr = [];
            let num = 1;
            do {
                try {
                    if (arrayErr.length > 0) {
                        arrayErr = await sendMail(transporter, arrayErr, emailOption);
                    } else {
                        arrayErr = await sendMail(transporter, result[0], emailOption);
                    }
                    num = ++num;
                } catch (error) {
                    console.log(error);
                }
            } while (arrayErr.length > 0 && num < 3);
        }
    })
}

async function getListEmailForSend(queryConfig) {
    let listEmail = await User.find(queryConfig, {email: 1});
    return listEmail;
}

async function sendMailToWorker(worker, notification) {
    let transporter = await nodemailer.createTransport(config.MAIL_TRANSPORTER);
    transporter.verify(async function (err, success) {
        if (err) {
            console.log(err);
        } else {
            let queryConfig = {role: constant.userRoles.WORKER, isActive: true};
            let result = await Promise.all([readTeamplate(), User.findOne({role: constant.userRoles.ADMIN})]);
            let teamplate = result[0];
            let admin = result[1];
            teamplate = teamplate.replace(/TREECODE/g, notification.tree.code);
            teamplate = teamplate.replace(/TREEPROBLEMS/g, notification.tree.description);
            teamplate = teamplate.replace(/LINK_DETAIL/g, process.env.LINK_NOTI_DETAIL + notification._id);
            teamplate = teamplate.replace(/LINK_IMAGE_DETECTED/g, notification.imageDetected);
            teamplate = teamplate.replace(/DISTRICT/g, notification.tree.districtName);

            let emailOption = {
                from: config.MAIL_OPTION.FROM,
                to: '',
                cc: admin.email,
                subject: config.MAIL_OPTION.WORKER_SUBJECT,
                html: teamplate
            }
            let arrayErr = [];
            let num = 1;
            do {
                try {
                    if (arrayErr.length > 0) {
                        arrayErr = await sendMail(transporter, arrayErr, emailOption);
                    } else {
                        arrayErr = await sendMail(transporter, worker, emailOption);
                    }
                    num = ++num;
                } catch (error) {
                    console.log(error);
                }
            } while (arrayErr.length > 0 && num < 3);
        }
    })
}
async function sendMail(transporter, listEmail, emailOption) {
    return new Promise((resolve, reject) => {
        let arrayErr = [];
        listEmail.map(async (email, index) => {
            emailOption.to = email.email;
            if (emailOption.to) {
                try {
                    let result = await sendMailWrapper(transporter, emailOption);
                    if (result === false) {
                        arrayErr.push(email);
                    }
                } catch (error) {
                    console.log(error);
                    reject(error)
                }
            }
            if (index === (listEmail.length - 1)) {
                resolve(arrayErr);
            }
        })
    })
}

function sendMailWrapper(transporter, emailOption) {
    return new Promise((resolve, reject) => {
        try {
            transporter.sendMail(emailOption, function (error, info) {
                if (error) {
                    resolve(false);
                }
                resolve(true);
                console.log(info);
            })
        } catch (error) {
            reject(error);
        }
    })
}

async function readTeamplate() {
    let data = await fs.readFile(filePath, 'utf-8');
    return data;
}
module.exports = {
    sendMailToManager,
    sendMailToWorker
}
