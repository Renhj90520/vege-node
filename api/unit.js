var models = require('../models');
var buildResult = require('../utils/resultutil');

sequelize = models.sequelize;


exports.addUnit = function (req, res) {
    models.units.create(req.body)
        .then(function (unit) {
            res.json(buildResult("添加成功", unit, 1));
        }).caught(function (err) {
            res.json(buildResult("添加失败：" + err.message, null, 0));
        });
}

exports.getAllUnits = function (req, res) {
    models.units.findAll()
        .then(function (units) {
            res.json(buildResult("获取成功", units, 1));
        }).caught(function (err) {
            res.json(buildResult("获取失败：" + err.message, null, 0));
        });
}

exports.updateUnit = function (req, res) {
    models.units.update(req.body, { where: { id: req.body.id } })
        .then(function () {
            res.json(buildResult("更新成功", null, 1));
        }).caught(function (err) {
            res.json(buildResult("更新失败：" + err.message, null, 0));
        });
}