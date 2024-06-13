var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var usersRouter = require('./routes/users');
var brandRouter = require('./routes/brandRouter');
var watchRouter = require('./routes/watchRouter');
var membersRouter = require('./routes/memberRouter');

const mongoose = require('mongoose');
var app = express();

const url = 'mongodb://localhost:27017/MemberAuth'
mongoose.connect(url).then((db) => {
  console.log('Connect success')
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: url,
    collectionName: 'sessions'
  })
}));

app.use('/', membersRouter);
app.use('/users', usersRouter);
app.use('/brands', brandRouter);
app.use('/watches', watchRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
