const express = require('express');
const router = express.Router();
const cameraController = require('../controllers/cameraController');
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();

router.get('/', async (req, res, next) => {
    let response = await cameraController.getListCamera(req.query);
    return res.send(response);
})

router.get('/:id', async (req, res, next) => {

})

router.post('/', multipartMiddleware, async (req, res, next) => {
    let response = await cameraController.createCamera(req.body, req.files);
    return res.send(response);
})

router.put('/', (req, res, next) => {

})

module.exports = router;