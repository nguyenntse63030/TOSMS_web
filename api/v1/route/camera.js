const express = require("express");
const router = express.Router();
const cameraController = require("../controllers/cameraController");
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();
const authorize = require("../middleware/authorize");
const constants = require('../../../configs/constant')

router.get("/", authorize([constants.userRoles.ADMIN, constants.userRoles.MANAGER]), async (req, res, next) => {
  try {
    let response = await cameraController.getListCamera(req.query, req.user);
    return res.send(response);
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).send(error);
  }
});

router.get("/stream/:id", authorize([constants.userRoles.ADMIN, constants.userRoles.MANAGER]), async (req, res, next) => {
  try {
    let response = await cameraController.getCameraStream(req.params.id)
    return res.send(response);
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).send(error);
  }
});

router.get("/:id", authorize([constants.userRoles.ADMIN, constants.userRoles.MANAGER]), async (req, res, next) => {
  try {
    let response = await cameraController.getDetailCamera(req.params.id);
    return res.send(response);
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).send(error);
  }
});

router.post("/", authorize([constants.userRoles.ADMIN, constants.userRoles.MANAGER]), multipartMiddleware, async (req, res, next) => {
  try {
    let response = await cameraController.createCamera(req.body, req.files, req.user);
    return res.send(response);
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).send(error);
  }
});
router.delete("/:id", authorize([constants.userRoles.ADMIN, constants.userRoles.MANAGER]), async (req, res, next) => {
  try {
    let response = await cameraController.deleteCamera(req.params.id);
    return res.send(response);
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).send(error);
  }
});
router.put("/:id", authorize([constants.userRoles.ADMIN, constants.userRoles.MANAGER]), async (req, res, next) => {
  try {
    let response = await cameraController.updateCamera(req.params.id, req.body, req.user);
    return res.send(response);
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).send(error);
  }
});
router.put("/:id/image", authorize([constants.userRoles.ADMIN, constants.userRoles.MANAGER]), multipartMiddleware, async (req, res, next) => {
  try {
    let response = await cameraController.uploadImage(req.params.id, req.files);
    return res.send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

module.exports = router;
