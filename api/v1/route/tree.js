const express = require('express')
const router = express.Router();
const treeController = require('../controllers/treeController')
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();

router.post('/', multipartMiddleware, async (req, res, next) => {
    try {
        let response = await treeController.createTree(req.body, req.files);
        return res.send(response);
    } catch (error) {
        return res.send(error);
    }
  
})

router.get('/:id', async (req, res, next) => {
    try {
        let response = await treeController.getDetailTree(req.params.id);
        return res.send(response);
    } catch (error) {
        return res.send(error);
    }
})

router.get('/', async (req, res, next) => {
    try {
        let response = await treeController.getListTree(req.query);
        return res.send(response);
    } catch (error) {
        return res.send(error)
    }
})
module.exports = router