const express = require('express');
const router = express.Router();
const cameraController = require('../controllers/cameraController');
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();

router.get('/', async (req, res, next) => {
    try {
        let response = await cameraController.getListCamera(req.query);
        return res.send(response);
    }
    catch (error) {
        return res.send(error)
    }
})

router.get('/:id', async (req, res, next) => {

})

router.post('/', multipartMiddleware, async (req, res, next) => {
    try {
        let response = await cameraController.createCamera(req.body, req.files);
        return res.send(response);
    } catch (error) {
        return res.send(error)
    }
})

router.put('/', (req, res, next) => {

})

module.exports = router;