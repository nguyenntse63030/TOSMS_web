const mongoose = require('mongoose')
require('../configs/loadModelsMongoose')
const User = mongoose.model('User')
const constants = require('../configs/constant')

let username = process.argv[2]
let password = process.argv[3]

// let username = 'admin'
// let password = '1111'

async function createAdmin() {
    try {
        if (!username || !password) {
            console.log('Vui lòng nhập vào username và password')
            process.exit()
        }
        let user = await User.findOne({ username: username })
        if (user) {
            console.log('Username đã tồn tại')
            process.exit()
        }
        let admin = new User()
        admin.username = username
        admin.role = constants.userRoles.ADMIN
        admin.password = password
        admin = await admin.save()
        console.log('Tạo tài khoản ADMIN thành công')
        console.log('Username: ', username)
        console.log('Password: ', password)
        console.log(admin)
        process.exit()
    } catch (error) {
        console.log(error)
        process.exit()
    }
}

createAdmin()