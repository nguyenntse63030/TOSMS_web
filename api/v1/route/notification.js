const express = require("express");
const router = express.Router();
const authorize = require("../middleware/authorize");
const notificationController = require('../controllers/notificationController');

router.get('/', async (req, res, next) => {
    let response = await notificationController.getListNotification(req.query);
    return res.send(response);
})

router.get('/:id', async (req, res, next) => {
    let id = req.params.id;
    let response = await notificationController.getNotification(id);
    return res.send(response);
})

router.put('/',  (req, res, next) => {
    let response = notificationController.setNotificationReaded();
    return;
})

module.exports = router;