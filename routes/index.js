var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Login' });
})

router.get('/employee', function (req, res, next) {
  res.render('employee/list', { title: 'Nhân Viên' })
})

router.get('/employee/:id', function (req, res, next) {
  res.render('employee/detail', { title: 'Hồ Sơ', code: '' })
})

router.get('/notification', function (req, res, next) {
  res.render('notification/list', { title: 'Notification' })
})

router.get('/notification/:id', function (req, res, next) {
  let treeID = req.params.id
  res.render('notification/detail', { title: 'Notification Detail', treeID: treeID })
})
module.exports = router;
