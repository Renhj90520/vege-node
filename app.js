var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = express.Router();
var app = express();
var jwt = require('./utils/jwt');
var settings = require('./utils/settings');

// view engine setup
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public/upload')));
app.use(express.static(path.join(__dirname, 'public')));
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    if (req.method == "OPTIONS")
        res.send(200);
    else next();
});

var api = {};
api.address = require('./api/address');
api.category = require('./api/category');
api.favorite = require('./api/favorite');
api.order = require('./api/order');
api.product = require('./api/product');
api.unit = require('./api/unit');
api.upload = require('./api/upload');
api.authorization = require('./api/authorization');

app.post('/authorization/login', api.authorization.signin);
app.get('/authorization', api.authorization.redirect);
app.get('/authorization/getuserinfo', api.authorization.getUserInfo);
app.post('/authorization/gettoken', api.authorization.gettoken);
app.get('/', function (req, res) {
    res.send("welcome to node");
});

app.use(function (req, res, next) {
    var token = req.headers.authorization.split(' ')[1];
    var payload = jwt.decode(token, settings.tokenkey);
    if (payload) {
        next();
    } else {
        res.status(401).send({ message: 'You are not authorized' })
    }
});

router.get('/addresses/:openid', api.address.getAddresses);
router.post('/addresses', api.address.addAddress);
router.delete('/addresses/:id', api.address.deleteAddr);

router.get('/categories', api.category.getCate);
router.post('/categories', api.category.addCate);
router.delete('/categories/:id/pictures/:picPath', api.category.removePic);
router.delete('/categories/:id', api.category.deleteCate);
router.put('/categories', api.category.updateCate);

router.get('/favorites/:openid', api.favorite.getFavorites);
router.get('/favorites/:openid/:productid', api.favorite.getFavorite);
router.post('/favorites', api.favorite.addFavorite);
router.delete('/favorites/:id', api.favorite.deleteFavorite);

router.get('/orders/:openid*?', api.order.getAllProductInOrder);
router.post('/orders', api.order.addOrder);
router.put('/orders/:id', api.order.updateOrder);
router.delete('/orders/:id', api.order.deleteOrder);

router.get('/products', api.product.getAllProducts);
router.get('/products/:id', api.product.getProduct);
router.post('/products', api.product.addProduct);
router.delete('/products/pictures/:picpath', api.product.deletePicture);
router.put('/products/:id', api.product.updateProduct);

router.post('/units', api.unit.addUnit);
router.get('/units', api.unit.getAllUnits);
router.put('/units', api.unit.updateUnit);

router.post('/upload', api.upload.upload);
app.use('/api', router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        // res.render('error', {
        //     message: err.message,
        //     error: err
        // });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    // res.render('error', {
    //     message: err.message,
    //     error: {}
    // });
});


module.exports = app;
