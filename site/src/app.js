require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const methodOverride =  require('method-override');
const session = require('express-session');
const localsUserCheck =require('./middlewares/localsUserCheck')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var cartRouter = require('./routes/cart');
var apisRouter = require('./routes/apis');
var adminRouter = require('./routes/admin/admin');
var productsAdminRouter = require('./routes/admin/products');
var categoriesAdminRouter = require('./routes/admin/categories');
var coloursAdminRouter = require('./routes/admin/colours');
var usersAdminRouter = require('./routes/admin/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(methodOverride('_method'));


app.use(session({
  secret : 'Mensaje',
  saveUninitialized : true,
  resave : false,
}));

app.use(localsUserCheck);


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/productos', productsRouter);
app.use('/cart',cartRouter);
app.use('/admin',adminRouter);
app.use('/apis',apisRouter);
app.use('/admin/products', productsAdminRouter)
app.use('/admin/categories', categoriesAdminRouter)
app.use('/admin/colours', coloursAdminRouter)
app.use('/admin/users', usersAdminRouter)


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
