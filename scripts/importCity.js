const mongoose = require('mongoose')
require('../configs/loadModelsMongoose')
const City = mongoose.model('City')
const District = mongoose.model('District')
const Ward = mongoose.model('Ward')
let citis = require('../city.json');
let http = require('https')

async function createCity() {
    citis.forEach(async city => {
        city.district = []
        let district = await District.find({ cityID: city.id })
        district.forEach(async (d, i) => {
            city.district[i] = d._id
        })
        await City.create(city)
    });
    console.log('success')
}

createCity()