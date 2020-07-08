const express = require("express");
const router = express.Router();
const authorize = require("../middleware/authorize");
const notificationController = require('../controllers/notificationController');
const constants = require('../../../configs/constant')

router.get('/', authorize(), async (req, res, next) => {
    try {
        let response = await notificationController.getListNotification(req);
        return res.send(response);
    } catch (error) {
        console.log(error);
        return res.status(error.status || 500).send(error);
    }
})

router.get('/:id', authorize(), async (req, res, next) => {
    try {
        let id = req.params.id;
        let response = await notificationController.getNotification(req, id);
        return res.send(response);
    } catch (error) {
        console.log(error);
        return res.status(error.status || 500).send(error);
    }
})

router.put('/', authorize(), (req, res, next) => {
    try {
        let response = notificationController.setNotificationReaded();
        return res.send(response)
    } catch (error) {
        console.log(error);
        return res.status(error.status || 500).send(error);
    }
})

router.put('/:id/worker', authorize([constants.userRoles.ADMIN, constants.userRoles.MANAGER]), async (req, res, next) => {
    try {
        let response = await notificationController.setWorkerToNoti(req);
        return res.send(response)
    } catch (error) {
        console.log(error);
        return res.status(error.status || 500).send(error);
    }
})

module.exports = router;