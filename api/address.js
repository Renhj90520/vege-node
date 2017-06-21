var models = require('../models');
sequelize = models.sequelize;
var buildResult = require('../utils/resultutil');

exports.getAddresses = function (req, res) {
    var openid = req.params.openid;
    models.addresses.findAll({ where: { openid: openid } })
        .then(function (addrs) {
            res.json(buildResult("获取成功", addrs, 1));
        }).caught(function (err) {
            res.json(buildResult("获取失败：" + err.message, null, 0));
        });
}

exports.addAddress = function (req, res) {
    models.addresses.create(req.body)
        .then(function (addr) {
            res.json(buildResult("添加成功", addr, 1));
        }).caught(function (err) {
            res.json(buildResult("添加失败：" + err.message, null, 0));
        });
}

exports.deleteAddr = function (req, res) {
    var id = req.params.id;
    models.addresses.destroy({ where: { id: id } })
        .then(function () {
            res.json(buildResult("删除成功", null, 1));
        }).caught(function (err) {
            res.json(buildResult("删除失败：" + err.message, null, 0));
        })
}