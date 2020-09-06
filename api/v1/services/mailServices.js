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
            let result = await getListEmailManager(notification);
            let data = await readTeamplate();
            let admin = await User.findOne({role: constant.userRoles.ADMIN});
            data = data.replace(/DISTRICT/g, result.district);
            data = data.replace(/LINK_DETAIL/g, process.env.LINK_NOTI_DETAIL + notification._id);
            data = data.replace(/LINK_IMAGE_DETECTED/g, notification.imageDetected);
            let emailOption = {
                from: config.MAIL_OPTION.FROM,
                to: '',
                cc: admin.email,
                subject: config.MAIL_OPTION.SUBJECT,
                html: data
            }
            let arrayErr = []
            do {
                try {
                    if (arrayErr.length > 0) {
                        arrayErr = await sendMail(transporter, arrayErr, emailOption);
                    } else {
                        arrayErr = await sendMail(transporter, result.listEmail, emailOption);
                    }
                } catch (error) {
                    console.log(error);
                }
            } while (arrayErr.length > 0);
        }
    })
}

async function getListEmailManager(notification) {
    let tree = await Tree.findOne({ _id: notification.tree })
    let listEmail = await User.find({ $or: [{ role: constant.userRoles.MANAGER, district: tree.district, isActive: true }, { role: constant.userRoles.ADMIN }] }, { email: 1 });
    let infor = {
        district: tree.districtName,
        listEmail: listEmail
    }
    return infor;
}

async function sendMailToWorker(worker, notification) {
    let transporter = await nodemailer.createTransport(config.MAIL_TRANSPORTER);
    transporter.verify(async function (err, success) {
        if (err) {
            console.log(err);
        } else {
            let data = await readTeamplate();
            let admin = await User.findOne({role: constant.userRoles.ADMIN});
            data = data.replace(/DISTRICT/g, notification.tree.districtName);
            data = data.replace(/LINK_DETAIL/g, process.env.LINK_NOTI_DETAIL + notification._id);
            data = data.replace(/LINK_IMAGE_DETECTED/g, notification.imageDetected);
            let emailOption = {
                from: config.MAIL_OPTION.FROM,
                to: worker.email,
                cc: admin.email,
                subject: config.MAIL_OPTION.WORKER_SUBJECT,
                html: data
            }
            try {
                let result = false;
                while (result === false) {
                    result = await sendMailWrapper(transporter, emailOption)
                } 
            } catch (error) {
                console.log(error)
            }
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
                console.log('thanh cong');
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
