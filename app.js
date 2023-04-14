var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var bodyPaser = require('body-parser');
var tieziRoter = require('./routes/luntan/tiezi');
var commentRouter = require('./routes/luntan/comment');
var userRouter = require('./routes/user/login');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyPaser.json());
app.use(bodyPaser.urlencoded({extended: false}));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));


app.use(cors());

app.use('/user', userRouter.register);
app.use('/user', userRouter.login);
app.use('/user', userRouter.authenticateToken);
app.use('/user', userRouter.add_following);

app.use('/tiezi', tieziRoter.get_all_tiezi);
app.use('/tiezi', tieziRoter.get_following_tiezi);
app.use('/tiezi', tieziRoter.add_post);
app.use('/tiezi', tieziRoter.delete_post);
app.use('/tiezi', tieziRoter.get_images_for_a_post);

app.use('/comment', commentRouter.get_comments_for_a_post);
app.use('/comment', commentRouter.add_comment);
app.use('/comment', commentRouter.delete_comment);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
