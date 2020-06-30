const mongoose = require('mongoose')
require('../configs/loadModelsMongoose')
const City = mongoose.model('City')
const District = mongoose.model('District')
const Ward = mongoose.model('Ward')
let citis = require('../city.json');
let http = require('https')

async function createCity() {
    citis.forEach(city => {
        city.huyen.forEach(h => {
            h.xa.forEach( async (x) => {
                x.districtID = x.huyen_id
                await Ward.create(x)
            })
        })
    });
    console.log('success')
}

createCity()