const mongoose = require('mongoose');
const City = mongoose.model('City');
const District = mongoose.model('District');
const responseStatus = require('../../../configs/responseStatus');

let getListCity = async () => {
    let cities = await City.find({}, { district: 0 }).sort({ name: 1 });
    return responseStatus.Code200({ cities });
}

let getCityById = async (id) => {
    let city
    if (id !== 'HCM') {
        city = await City.findOne({ _id: id }).sort({ name: 1 }).populate('district', { ward: 0 });
    } else {
        city = await City.findOne().populate('district', { ward: 0 });
    }
    if (!city) {
        throw responseStatus.Code500();
    }
    return responseStatus.Code200({ districts: city.district });
}

let getDistrictById = async (id) => {
    let district = await District.findOne({ _id: id }).sort({ name: 1 }).populate('ward')
    if (!district) {
        throw responseStatus.Code500();
    }
    return responseStatus.Code200({ wards: district.ward });
}
module.exports = {
    getListCity,
    getCityById,
    getDistrictById
}