const mongoose = require('mongoose')
require('../configs/loadModelsMongoose')
const City = mongoose.model('City')
const District = mongoose.model('District')
const Ward = mongoose.model('Ward')
let citis = require('../city.json');
let http = require('https')

async function createCity() {
    citis.forEach(city => {
        city.huyen.forEach(async h => {
            h.cityID = h.tinh_id
            h.ward = []
            let ward = await Ward.find({districtID: h.id})
            ward.forEach( async (w, i) => {
                h.ward[i] = w._id
            })
            await District.create(h)
        })
    });
    console.log('success')
}

createCity()