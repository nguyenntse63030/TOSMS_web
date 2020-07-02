var express = require("express");
var router = express.Router();
const authService = require("../api/v1/services/authService");

/* GET home page. */
router.get("/", async function (req, res, next) {
  const token = req.session.token;
  if (token) {
    await authService.isLogin(token);
    return res.redirect("/notification");
  } else {
    return res.render("index", { title: "Login" });
  }
});

router.get("/*", async function (req, res, next) {
  const token = req.session.token;
  try {
    if (req.url.indexOf("/api/v1/") === 0) {
      return next();
    } else {
      await authService.isLogin(token);
      return next();
    }
  } catch (error) {
    return res.redirect("/");
  }
});

router.get("/employee", function (req, res, next) {
  res.render("employee/list", { title: "Nhân Viên" });
});
router.get("/employee/create", function (req, res, next) {
  res.render("employee/create", { title: "Tạo User" });
});

router.get("/employee/:id", function (req, res, next) {
  res.render("employee/detail", { title: "Hồ Sơ", code: req.params.id });
});

router.get("/tree", function (req, res, next) {
  res.render("tree/list", { title: "Cây" });
});

router.get("/tree/create", function (req, res, next) {
  res.render("tree/create", { title: " Tạo Thông Tin Cây" });
});

router.get("/tree/:id", function (req, res, next) {
  res.render("tree/detail", { title: "Chi Tiết Cây", id: req.params.id });
});

router.get("/camera/create", function (req, res, next) {
  res.render("camera/create", { title: "Tạo Thông Tin Camera" });
});

router.get("/notification", function (req, res, next) {
  res.render("notification/list", { title: "Notification" });
});

router.get("/notification/:id", function (req, res, next) {
  let notificationId = req.params.id;
  res.render("notification/detail", {
    title: "Notification Detail",
    notificationId: notificationId,
  });
});
module.exports = router;
