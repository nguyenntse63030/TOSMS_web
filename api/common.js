const responseStatus = require("../configs/responseStatus")
const { response } = require("express")
const constant = require("../configs/constant")
const { type_func } = require("../configs/constant")

function changeAlias(str) {
    if (!str) return ''
    str = str.toLowerCase().trim()
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
    str = str.replace(/đ/g, 'd')
    return str
}

function parseNumberToMoney(number) {
    if (!number) return 0
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function formatDate(date) {
    now = new Date(date);
    year = "" + now.getFullYear();
    month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
    day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
    hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
    minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
    second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
    return day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second;
}

function formatDateV2(date) {
    now = new Date(date);
    year = "" + now.getFullYear();
    month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
    day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
    hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
    minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
    second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
    return day + "/" + month + "/" + year;
}

function formatDateCode(date) {
    now = new Date(date);
    year = "" + now.getFullYear();
    month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
    day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
    return day.toString() + month.toString() + year.toString()
}

function getTimestampBeginOfMonth(timestamp) {
    var now = new Date(timestamp)
    now.setHours(0, 0, 0, 0)
    now.setDate(1)
    return Math.round(now.getTime())
}

function getTimestampEndOfMonth(timestamp) {
    var now = new Date(timestamp)
    now.setHours(0, 0, 0, 0)
    now.setDate(1)
    now.setMonth(now.getMonth() + 1)
    return Math.round(now.getTime() - 1)
}

function isEmptyObject(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function validateDataTree(tree) {
    if (!tree.image) {
        throw responseStatus.Code400({ errorMessage: responseStatus.TREE_IMAGE_IS_CANT_EMPTY });
    }
    if (!tree.code) {
        throw responseStatus.Code400({ errorMessage: responseStatus.TREE_CODE_CANT_EMPTY })
    }
    if (!tree.treeType) {
        throw responseStatus.Code400({ errorMessage: responseStatus.TREE_TYPE_IS_CANT_EMPTY });
    }
    if (!tree.street) {
        throw responseStatus.Code400({ errorMessage: responseStatus.TREE_STREET_IS_CANT_EMPTY });
    }
    if (!tree.city) {
        throw responseStatus.Code400({ errorMessage: responseStatus.TREE_CITY_IS_CANT_EMPTY });
    }
    if (!tree.district) {
        throw responseStatus.Code400({ errorMessage: responseStatus.TREE_DISTRICT_IS_CANT_EMPTY });
    }
    if (!tree.ward) {
        throw responseStatus.Code400({ errorMessage: responseStatus.TREE_WARD_IS_CANT_EMPTY });
    }
}

function createMapsUrl(lat, long) {
    let destination = lat + ',' + long
    let url = constant.googleMapsURL + encodeURIComponent(destination)
    return url
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    changeAlias,
    parseNumberToMoney,
    formatDate,
    formatDateV2,
    formatDateCode,
    getTimestampBeginOfMonth,
    getTimestampEndOfMonth,
    isEmptyObject,
    validateDataTree,
    createMapsUrl,
    getRandomInt
}