const mongoose = require('mongoose');
const City = mongoose.model('City');
const District = mongoose.model('District');
const responseStatus = require('../../../configs/responseStatus');

let getListCity = async () => {
    let cities = await City.find({},{district: 0});
    return responseStatus.Code200({cities});
}

let getCityById = async (id) => {
    id = parseInt(id)
    let city = await City.findOne({id: id}).populate('district', {ward: 0});
    if (!city) {
        throw responseStatus.Code500();
    }
    return responseStatus.Code200({districts: city.district});
}

let getDistrictById = async (id) => {
    id = parseInt(id);
    let district = await District.findOne({id: id}).populate('ward')
    if (!district) {
        throw responseStatus.Code500();
    }
    return responseStatus.Code200({wards: district.ward});
}
module.exports = {
    getListCity,
    getCityById,
    getDistrictById
}