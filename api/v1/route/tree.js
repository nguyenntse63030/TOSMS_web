const express = require('express')
const router = express.Router();
const treeController = require('../controllers/treeController')
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();
const authorize = require("../middleware/authorize");
const constants = require('../../../configs/constant')

router.post('/', authorize([constants.userRoles.ADMIN, constants.userRoles.MANAGER]), multipartMiddleware, async (req, res, next) => {
    try {
        let response = await treeController.createTree(req.body, req.files);
        return res.send(response);
    } catch (error) {
        console.log(error);
        return res.status(error.status || 500).send(error);
    }

})

router.put('/:id', authorize([constants.userRoles.ADMIN, constants.userRoles.MANAGER]), async (req, res, next) => {
    try {
        let response = await treeController.updateTree(req.params.id, req.body);
        return res.send(response);
    } catch (error) {
        console.log(error);
        return res.status(error.status || 500).send(error);
    }
})

router.put('/:id/image', authorize([constants.userRoles.ADMIN, constants.userRoles.MANAGER]), multipartMiddleware, async (req, res, next) => {
    try {
        let response = await treeController.uploadImage(req.params.id, req.files);
        return res.send(response);
    } catch (error) {
        console.log(error);
        return res.status(error.status || 500).send(error);
    }
})

router.delete('/:id', authorize([constants.userRoles.ADMIN, constants.userRoles.MANAGER]), async (req, res, next) => {
    try {
        let response = await treeController.deleteTree(req.params.id);
        return res.send(response);
    } catch (error) {
        console.log(error);
        return res.status(error.status || 500).send(error);
    }
})

router.get('/', authorize([constants.userRoles.ADMIN, constants.userRoles.MANAGER]), async (req, res, next) => {
    try {
        let response = await treeController.getListTree(req.query);
        return res.send(response);
    } catch (error) {
        console.log(error);
        return res.status(error.status || 500).send(error);
    }
})

router.get('/:id/notification', authorize(), async (req, res, next) => {
    try {
        let response = await treeController.getListNotiOfTree(req);
        return res.send(response);
    } catch (error) {
        console.log(error);
        return res.status(error.status || 500).send(error);
    }
})

router.get('/:id', authorize(), async (req, res, next) => {
    try {
        let response = await treeController.getDetailTree(req.params.id);
        return res.send(response);
    } catch (error) {
        console.log(error);
        return res.status(error.status || 500).send(error);
    }
})


module.exports = router