var models = require('../models');
sequelize = models.sequelize;
var buildResult = require('../utils/resultutil');
var fs = require('fs');

exports.addCate = function (req, res) {
    models.categories.create(req.body)
        .then(function (cate) {
            res.json(buildResult("添加成功", cate, 1));
        }).caught(function (err) {
            res.json(buildResult("添加失败：" + err.message, null, 0));
        });
}

exports.getCate = function (req, res) {
    models.categories.findAll()
        .then(function (cates) {
            res.json(buildResult("获取成功", cates, 1));
        }).caught(function (err) {
            res.json(buildResult("获取失败：" + err.message, null, 0));
        });
}

exports.removePic = function (req, res) {
    var id = req.params.id;
    var picPath = 'public/' + req.params.picPath;
    models.categories.update({ IconPath: null }, { where: { id: id } })
        .then(function () {
            if (fs.exists(picPath)) {
                fs.unlink(picPath, function (err) {
                    if (err) {
                        res.json(buildResult("删除失败：" + err.message, null, 0));
                    }
                    res.json(buildResult("删除成功", null, 1));
                });
            } else {
                res.json(buildResult("删除成功", null, 1));
            }
        }).caught(function (err) {
            res.json(buildResult("删除失败：" + err.message, null, 0));
        })
}

exports.deleteCate = function (req, res) {
    var id = req.params.id;
    models.categories.findOne({ where: { Id: id } })
        .then(function (cate) {
            models.categories.destroy({ where: { Id: id } })
                .then(function () {
                    var fullpath = cate.IconPath;
                    if (fullpath && fullpath.indexOf('/') > 0) {
                        var fileName = fullpath.substring(fullpath.lastIndexOf('/'), fullpath.length);
                        if (fs.exists('public' + fileName)) {
                            fs.unlink('public' + fileName, function (err) {
                                if (err) {
                                    res.json(buildResult("删除失败：" + err.message, null, 0));
                                }
                                res.json(buildResult("删除成功", null, 1));
                            });
                        } else {
                            res.json(buildResult("删除成功", null, 1));
                        }
                    }
                }).caught(function (err) {
                    res.json(buildResult("删除失败：" + err.message, null, 0));
                });
        }).caught(function (err) {
            res.json(buildResult("删除失败：" + err.message, null, 0));
        });
}

exports.updateCate = function (req, res) {
    models.categories.update(req.body, { where: { Id: req.body.Id } })
        .then(function () {
            res.json(buildResult("更新成功", null, 1));
        }).caught(function (err) {
            res.json(buildResult("更新失败：" + err.message, null, 0))
        });
}