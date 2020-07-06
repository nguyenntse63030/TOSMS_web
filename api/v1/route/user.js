const express = require("express");
const router = express.Router();
const authorize = require("../middleware/authorize");
const userController = require("../controllers/userController");
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();

router.get("/", async (req, res, next) => {
  try {
    let response = await userController.getListUser(req.query);
    return res.send(response);
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).send(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    let response = await userController.getUser(id);
    return res.send(response);
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).send(error);
  }
});

router.post("/", multipartMiddleware, async (req, res, next) => {
  try {
    let response = await userController.createUser(req.body, req.files);
    return res.send(response);
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).send(error);
  }
});

router.put("/:id/image", multipartMiddleware, async (req, res, next) => {
  try {
    let response = await userController.uploadImage(req.params.id, req.files);
    return res.send(response);
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).send(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    let response = await userController.updateUser(req.params.id, req.body);
    return res.send(response);
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).send(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    let response = await userController.deleteUser(req.params.id);
    return res.send(response);
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).send(error);
  }
});

module.exports = router;
