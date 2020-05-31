var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Login" });
});

router.get("/employee", function (req, res, next) {
  res.render("employee/list", { title: "Nhân Viên" });
});
router.get("/employee/create", function (req, res, next) {
  res.render("employee/create", { title: "Tạo User" });
});

router.get("/employee/:id", function (req, res, next) {
  res.render("employee/detail", { title: "Hồ Sơ", code: "" });
});

router.get("/tree", function (req, res, next) {
  res.render("tree/list", { title: "Cây" });
});
router.get("/tree/create", function (req, res, next) {
  res.render("tree/create", { title: " Tạo Thông Tin Cây" });
});
router.get("/camera/create", function (req, res, next) {
  res.render("camera/create", { title: "Tạo Thông Tin Camera" });
});

<<<<<<< HEAD
router.get("/notification", function (req, res, next) {
  res.render("notification/list", { title: "Notification" });
});
=======
router.get('/tree/:id', function (req, res, next) {
  res.render('tree/detail', { title: 'Chi Tiết Cây', code: '' })
})

router.get('/notification', function (req, res, next) {
  res.render('notification/list', { title: 'Notification' })
})
>>>>>>> 7fd61204c79c0570a5eb2479c89b5177ac7dfcd1

router.get("/notification/:id", function (req, res, next) {
  let treeID = req.params.id;
  res.render("notification/detail", {
    title: "Notification Detail",
    treeID: treeID,
  });
});
module.exports = router;
