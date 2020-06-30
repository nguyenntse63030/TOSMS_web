const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

router.get('/city', async (req, res, next) => {
    let response = await locationController.getListCity();
    return res.send(response);
})

router.get('/city/:id', async (req, res, next) => {
    let response = await locationController.getCityById(req.params.id);
    return res.send(response);
})

router.get('/district/:id', async (req, res, next) => {
    let response = await locationController.getDistrictById(req.params.id);
    return res.send(response);
})


module.exports = router