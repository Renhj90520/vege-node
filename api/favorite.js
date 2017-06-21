var models = require('../models');
var buildResult = require('../utils/resultutil');
sequelize = models.sequelize;

exports.getFavorites = function (req, res) {
    var openid = req.params.openid;
    models.favorites.findAll({ where: { openid: openid } })
        .then(function (favs) {
            res.json(buildResult("获取成功", favs, 1));
        }).caught(function (err) {
            res.jsong(buildResult("获取失败：" + err.message, null, 0));
        });
}

exports.getFavorite = function (req, res) {
    var openid = req.params.openid;
    var productid = req.params.productid;
    models.favorites.findAll({ where: { openid: openid, productid: productid } })
        .then(function (favs) {
            res.json(buildResult("获取成功", favs, 1));
        }).caught(function (err) {
            res.jsong(buildResult("获取失败：" + err.message, null, 0));
        });
}

exports.addFavorite = function (req, res) {
    models.favorites.create(req.body)
        .then(function (fav) {
            res.json(buildResult("添加成功", fav, 1));
        }).caught(function (err) {
            res.jsong(buildResult("添加失败：" + err.message, null, 0));
        });
}

exports.deleteFavorite = function (req, res) {
    var id = req.params.id;
    models.destroy({ where: { id: id } })
        .then(function () {
            res.json(buildResult("删除成功", null, 1));
        }).caught(function (err) {
            res.json(buildResult("删除失败：" + err.message, null, 0));
        });
}