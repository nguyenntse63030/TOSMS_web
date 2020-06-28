const mongoose = require('mongoose')
require('../configs/loadModelsMongoose')
const User = mongoose.model('User')

async function resetPassword(phone, newPassword) {
  try {
    let user = await User.findOne({ phone: phone })
    if (user) {
      user.password = user.hashPassword(newPassword)
      await user.save()
      console.log('Dat lai mat khau thanh cong')
    } else {
      console.log('Username khong ton tai')
    }
  } catch (error) {
    console.log(error)
  }
}

resetPasswordAllUser()
async function resetPasswordAllUser() {
  try {
    let users = await User.find()
    for (let u of users) {
      await resetPassword(u.phone, '1')
    }
    console.log('Done')
  } catch (error) {
    console.log('Error: ', error)
  }
  return process.exit()
}
