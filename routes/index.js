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

router.get('/tree', function (req, res, next) {
  res.render('tree/list', { title: 'Cây' })
})

router.get('/notification', function (req, res, next) {
  res.render('notification/list', { title: 'Notification' })
})
module.exports = router;
