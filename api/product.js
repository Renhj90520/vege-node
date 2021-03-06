var models = require('../models');
var buildResult = require('../utils/resultutil');
var fs = require('fs');
sequelize = models.sequelize;

exports.getAllProducts = function (req, res) {
    var category = req.query.category;
    var index = req.query.index;
    var perPage = req.query.perPage;
    var name = req.query.name;

    var where = { State: 1 };
    if (category) {
        where.categoryid = category;
    }
    if (name) {
        where.name = name;
    }
    var condition = {};
    if (where) {
        condition.where = where;
    }

    if (index && perPage) {
        condition.limit = parseInt(perPage);
        condition.offset = (index - 1) * perPage;
    }

    condition.include = [{ model: models.pictures, as: 'Pictures', require: false }];
    models.products.hasMany(models.pictures, { as: 'Pictures' });
    models.products.findAndCountAll(condition)
        .then(function (products) {
            res.json(buildResult("获取成功", { count: products.count, items: products.rows }, 1));
        }).caught(function (err) {
            res.json(buildResult("获取失败：" + err.message, null, 0));
        });
}

exports.getProduct = function (req, res) {
    var id = req.params.id;
    models.products.hasMany(models.pictures, { as: 'Pictures' });
    models.products.findOne({ where: { Id: id }, include: [{ model: models.pictures, as: 'Pictures', require: false }] })
        .then(function (product) {
            res.json(buildResult("获取成功", { items: [product] }, 1));
        }).caught(function (err) {
            res.json(buildResult("获取失败：" + err.message, null, 0));
        });
}

exports.addProduct = function (req, res) {

    return sequelize.transaction(function (t) {

        req.body.Pictures.forEach(function (pic) {
            models.pictures.create(pic);
        });

        return models.products.create(req.body, { transaction: t })
            .then(function (product) {
                res.json(buildResult("添加成功", product, 1));
            }).caught(function (err) {
                res.json(buildResult("添加失败：" + err.message, null, 0));
            });
    })

}

exports.deletePicture = function (req, res) {
    var path = req.params.picpath;
    models.pictures.destroy({ where: { path: { $like: '%' + path + '%' } } })
        .then(function () {
            if (fs.exists('public/upload/' + path)) {
                fs.unlink('public/upload/' + path, function (err) {
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

exports.updateProduct = function (req, res) {
    var id = req.params.id;
    models.products.update(req.body, { where: { id: id } })
        .then(function () {
            res.json(buildResult("更新成功", null, 1));
        }).caught(function (err) {
            res.json(buildResult("更新失败：" + err.message, null, 0));
        });
}

