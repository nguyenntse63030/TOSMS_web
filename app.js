var createError = require("http-errors");
var express = require("express");
var path = require("path");
var ejsLocals = require("ejs-locals");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require('express-session')
const config = require('./config')
require('./configs/loadModelsMongoose')

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();
require('./configs/passport').createPassportConfig(app)

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsLocals);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
  name: 'TOSMS_WEB',
  secure: true,
  httpOnly: true,
  secret: config.secret,
  resave: false,
  saveUninitialized: true
}))

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/v1/upfile-to-s3", require("./api/v1/route/upfileToS3"));
app.use("/api/v1/python", require("./api/v1/route/python"));
app.use("/api/v1/notification", require("./api/v1/route/notification"));
app.use("/api/v1/location", require('./api/v1/route/location'));
app.use("/api/v1/tree", require("./api/v1/route/tree"));
app.use("/api/v1/auth", require("./api/v1/route/auth"));
// require('./scripts/createAdmin')

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
