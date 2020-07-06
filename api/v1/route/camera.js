const express = require("express");
const router = express.Router();
const cameraController = require("../controllers/cameraController");
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();

router.get("/", async (req, res, next) => {
  try {
    let response = await cameraController.getListCamera(req.query);
    return res.send(response);
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).send(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    let response = await cameraController.getDetailCamera(req.params.id);
    return res.send(response);
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).send(error);
  }
});

router.post("/", multipartMiddleware, async (req, res, next) => {
  try {
    let response = await cameraController.createCamera(req.body, req.files);
    return res.send(response);
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).send(error);
  }
});
router.delete("/:id", async (req, res, next) => {
  try {
    let response = await cameraController.deleteCamera(req.params.id);
    return res.send(response);
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).send(error);
  }
});
router.put("/:id", async (req, res, next) => {
  try {
    let response = await cameraController.updateCamera(req.params.id, req.body);
    return res.send(response);
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).send(error);
  }
});
router.put("/:id/image", multipartMiddleware, async (req, res, next) => {
  try {
    let response = await cameraController.uploadImage(req.params.id, req.files);
    return res.send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

module.exports = router;
