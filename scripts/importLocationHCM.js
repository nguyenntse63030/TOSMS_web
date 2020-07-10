const mongoose = require('mongoose')
require('../configs/loadModelsMongoose')
const City = mongoose.model('City')
const District = mongoose.model('District')
const Ward = mongoose.model('Ward')
let cities = require('../city.json');

let createAll = async () => {
    console.log('start')
    for (city of cities) {
        if (city.name === 'Thành phố Hồ Chí Minh') {
            let huyens = city.huyen;
            let arrHuyen = [];
            for (huyen of huyens) {
                let xas = huyen.xa;
                let arrXa = [];
                for (xa of xas) {
                    xa.districtID = xa.huyen_id
                    let ward = await Ward.create(xa)
                    arrXa.push(ward._id)
                }
                huyen.ward = arrXa;
                huyen.cityID = huyen.tinh_id
                let district = await District.create(huyen)
                arrHuyen.push(district._id)
            }
            city.district = arrHuyen;
            let _city = await City.create(city)
            console.log(_city)
        }

    }
    console.log('success')
}

createAll()