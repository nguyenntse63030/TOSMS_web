const mongoose = require('mongoose')
const User = mongoose.model('User')
const responseStatus = require('../../../configs/responseStatus')
const common = require('../../common')
const jwt = require('jsonwebtoken')
const AWS = require('aws-sdk');
const config = require('../../../config')
const roomController = require('./roomController')
const constant = require('../../../configs/constant')
const mssql = require('mssql')

async function getUserByUsername(username) {
}



module.exports = {
    getUserByUsername
}