const express = require("express");
const router = express.Router();
const authorize = require("../middleware/authorize");
const userController = require("../controllers/userController");
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();
const constants = require('../../../configs/constant')

router.get("/", authorize([constants.userRoles.ADMIN, constants.userRoles.MANAGER]), async (req, res, next) => {
  try {
    let response = await userController.getListUser(req, req.query);
    return res.send(response);
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).send(error);
  }
});

router.get("/worker", authorize([constants.userRoles.ADMIN, constants.userRoles.MANAGER]), async (req, res, next) => {
  try {
    let response = await userController.getListWorker();
    return res.send(response);
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).send(error);
  }
});

router.get("/:id", authorize(), async (req, res, next) => {
  try {
    let id = req.params.id;
    let response = await userController.getUser(req, id);
    return res.send(response);
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).send(error);
  }
});

router.post("/", authorize([constants.userRoles.ADMIN, constants.userRoles.MANAGER]), multipartMiddleware, async (req, res, next) => {
  try {
    let response = await userController.createUser(req, req.body, req.files);
    return res.send(response);
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).send(error);
  }
});

router.put("/:id/image", authorize(), multipartMiddleware, async (req, res, next) => {
  try {
    let response = await userController.uploadImage(req, req.params.id, req.files);
    return res.send(response);
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).send(error);
  }
});

router.put("/:id", authorize(), async (req, res, next) => {
  try {
    let response = await userController.updateUser(req, req.params.id, req.body);
    return res.send(response);
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).send(error);
  }
});

router.delete("/:id", authorize([constants.userRoles.ADMIN, constants.userRoles.MANAGER]), async (req, res, next) => {
  try {
    let response = await userController.deleteUser(req.params.id);
    return res.send(response);
  } catch (error) {
    console.log(error);
    return res.status(error.status || 500).send(error);
  }
});
// router.post("/", authorize([constants.userRoles.ADMIN, constants.userRoles.MANAGER]), multipartMiddleware, async (req, res, next) => {
//   try {
//     let response = await userController.createUser(req.body, req.files);
//     return res.send(response);
//   } catch (error) {
//     console.log(error);
//     return res.status(error.status || 500).send(error);
//   }
// });

module.exports = router;
