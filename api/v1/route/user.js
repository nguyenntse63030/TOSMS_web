const express = require("express");
const router = express.Router();
const authorize = require("../middleware/authorize");
const userController = require("../controllers/userController");

router.get("/", async (req, res, next) => {
  let response = await userController.getListUser(req.query);
  return res.send(response);
});
router.get("/:id", async (req, res, next) => {
  let id = req.params.id;
  let response = await userController.getUser(id);
  return res.send(response);
});

module.exports = router;
