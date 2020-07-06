const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

router.get('/city', async (req, res, next) => {
    try {
        let response = await locationController.getListCity();
        return res.send(response);
    } catch (error) {
        console.log(error);
        return res.status(error.status || 500).send(error);
    }
})

router.get('/city/:id', async (req, res, next) => {
    try {
        let response = await locationController.getCityById(req.params.id);
        return res.send(response);
    } catch (error) {
        console.log(error);
        return res.status(error.status || 500).send(error);
    }

})

router.get('/district/:id', async (req, res, next) => {
    try {
        let response = await locationController.getDistrictById(req.params.id);
        return res.send(response);
    } catch (error) {
        console.log(error);
        return res.status(error.status || 500).send(error);
    }

})

module.exports = router