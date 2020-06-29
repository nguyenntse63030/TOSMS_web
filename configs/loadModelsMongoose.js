const config = require('../config')
const mongoose = require('mongoose')
const fs = require('fs')
var path = require('path')

mongoose.Promise = global.Promise
mongoose.connect(config.uriMongo, {useNewUrlParser: true, useUnifiedTopology: true})

const MODEL_PATH = path.join(__dirname, '../models')

fs.readdirSync(MODEL_PATH).forEach((file) => {
  var filePath = path.join(MODEL_PATH, file)
  require(filePath)
})
