var jwt = require('jsonwebtoken') // used to create, sign, and verify tokens
var mongoose = require('mongoose')
var User = mongoose.model('User')
var config = require('../../../config')
var responseStatus = require('../../../configs/responseStatus')
var constants = require('../../../configs/constant')
const userController = require('../controllers/userController')

async function isLogin(token) {
    let decode = await jwt.verify(token, config.secret)
    if (!token) {
        if (err) {
            throw responseStatus.Code400({ errorMessage: responseStatus.INVALID_REQUEST })
        }
        if (!decode || !decode.username) {
            throw responseStatus.Code400({ errorMessage: responseStatus.INVALID_REQUEST })
        }
        const username = decode.username
        let user = await User.findOne({ username: username })
        if (!user) {
            throw responseStatus.Code400({ errorMessage: responseStatus.INVALID_REQUEST })
        }
        return responseStatus.Code200({ user: user })
    }
}
module.exports = {
    isLogin
}
