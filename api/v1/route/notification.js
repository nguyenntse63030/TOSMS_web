const express = require("express");
const router = express.Router();
const authorize = require("../middleware/authorize");
const notificationController = require('../controllers/notificationController');

router.get('/', async (req, res, next) => {
    try {
        let response = await notificationController.getListNotification(req.query);
        return res.send(response);
    } catch (error) {
        return res.send(error);
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let response = await notificationController.getNotification(id);
        return res.send(response);
    } catch (error) {
        return res.send(error);
    }
})

router.put('/', (req, res, next) => {
    try {
        let response = notificationController.setNotificationReaded();
        return res.send(response)
    } catch (error) {
        return res.send(error);
    }
})

module.exports = router;