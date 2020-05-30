var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Login' });
})

router.get('/notification', function (req, res, next) {
  res.render('notification/list', { title: 'Notification' })
})
module.exports = router;
