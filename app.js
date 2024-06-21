var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var brandRouter = require('./routes/brandRouter');
var watchRouter = require('./routes/watchRouter');
var membersRouter = require('./routes/memberRouter');
var authRouter = require('./routes/authRouter');

const passport = require('passport');
const flash = require('connect-flash');


const mongoose = require('mongoose');
var app = express();
require('./config/passport')(passport);

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
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: url,
    collectionName: 'sessions'
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  if(req.session.passport) {
    res.locals.user = req.session.passport.user;
  }
  next();
});


app.use('/', membersRouter);
app.use('/notfound', function(req, res, next) {
  res.render('notfound')
})
app.use('/auth', authRouter);
app.use('/brands', brandRouter);
app.use('/watches', watchRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.render('notfound')
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
