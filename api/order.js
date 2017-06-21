var models = require('../models');
var buildResult = require('../utils/resultutil');

sequelize = models.sequelize;

exports.getAllProductInOrder = function (req, res) {
    var openid = req.params.openid;
    var index = req.query.index;
    var perPage = req.query.perPage;
    var keyword = req.query.keyword;
    var begin = req.query.begin;
    var end = req.query.end;
    var noshowRemove = req.query.noshowRemove;

    var sqlStr = 'select o.id,a.area,o.canceltime,o.createtime,a.name,o.openid,a.phone,a.province,o.state,a.street,o.deliverycharge from orders o left join addresses a on a.id=o.addressid';
    var countStr = 'select count(*) from orders o inner join addresses a on a.id=o.addressid'
    sqlStr += " where 1=1 ";
    countStr += " where 1=1 ";
    var replacements = {};
    if (openid) {
        sqlStr += "and openid=:openid ";
        replacements.openid = openid;
    }

    if (keyword) {
        sqlStr += "and (o.name like :keyword or a.phone like :keyword) ";
        countStr += "and (o.name like :keyword or a.phone like :keyword) ";
        replacements.keyword = "%" + keyword + "%";
    }

    if (begin) {
        sqlStr += "and o.createtime>=:begin ";
        countStr += "and o.createtime>=:begin ";
        replacements.begin = begin;
    }

    if (end) {
        sqlStr += "and o.createtime<:end ";
        countStr += "and o.createtime<:end ";
        var parts = end.split('-');
        replacements.end = new Date(parts[0], parts[1] + 1, parts[2]);
    }

    if (noshowRemove && noshowRemove === "true") {
        sqlStr += 'and o.state!=:state ';
        countStr += 'and o.state!=:state ';
        replacements.state = '4';
    }

    sequelize.query(countStr, { replacements: replacements, type: sequelize.QueryTypes.SELECT })
        .then(function (totalcount) {
            sqlStr += 'order by o.state ASC,o.id DESC ';

            if (index && perPage) {
                sqlStr += 'limit ' + parseInt(perPage);
                sqlStr += ' offset ' + ((parseInt(index) - 1) * parseInt(perPage));
            }

            sequelize.query(sqlStr, { replacements: replacements, type: sequelize.QueryTypes.SELECT })
                .then(function (items) {

                    var count = 0;
                    var productStr = 'select p.id,p.categoryid,oi.count,p.description,p.name,oi.price,p.state,p.step,p.totalcount,p.unitid,p.unitname from orderitems oi left join products p on  p.id=oi.productid where oi.orderid=:oid';
                    items.forEach(function (item) {
                        var innerreplace = { oid: item.id };
                        sequelize.query(productStr, { replacements: innerreplace, type: sequelize.QueryTypes.SELECT })
                            .then(function (products) {
                                var ic = 0;
                                products.forEach(function (pro) {
                                    models.pictures.findAll({ where: { ProductId: pro.id } })
                                        .then(function (pictures) {
                                            pro.pictures = pictures;
                                            ic++;
                                            if (ic === products.length) {
                                                item.products = products;
                                                count++;
                                                if (count === items.length) {
                                                    res.json(buildResult("获取成功", { count: totalcount, items: items }, 1));
                                                }
                                            }
                                        }).caught(function (err) {
                                            ic++;
                                            if (ic === products.count) {
                                                item.products = products;
                                                count++;
                                                if (count === items.length) {
                                                    res.json(buildResult("获取成功", { count: totalcount, items: items }, 1));
                                                }
                                            }
                                        });
                                })
                            }).caught(function (err) {
                                count++;
                                if (count === items.length) {
                                    res.json(buildResult("获取成功", { count: totalcount, items: items }, 1));
                                }
                            });
                    });
                }).caught(function (err) {
                    res.json(buildResult("获取失败：" + err.message, null, 0));
                });
        }).caught(function (err) {
            res.json(buildResult("获取失败：" + err.message, null, 0));
        });
}

exports.addOrder = function (req, res) {
    var products = req.body.products.filter(function (pro) {
        return pro.Count > 0;
    });

    return sequelize.transaction(function (t) {
        req.body.CreateTime = new Date();
        req.body.CancelTime = new Date(0);
        req.body.FinishTime = new Date(0);
        return models.orders.create(req.body, { transaction: t })
            .then(function (order) {
                var count = 0;

                for (var i = 0; i < products.length; i++) {
                    var product = products[i];
                    product.OrderId = order.Id;
                    if (i < products.length - 1) {
                        models.orderitems.create(product, { transaction: t })
                            .then(function () {
                                count++;
                                if (count === products.length) {
                                    res.json(buildResult("添加成功", null, 1));
                                }
                            }).caught(function (err) {
                                count++;
                                if (count === products.length) {
                                    res.json(buildResult("添加成功", null, 1));
                                }
                            })
                    } else {
                        return models.orderitems.create(product, { transaction: t })
                            .then(function () {
                                count++;
                                if (count === products.length) {
                                    res.json(buildResult("添加成功", null, 1));
                                }
                            }).caught(function (err) {
                                count++;
                                if (count === products.length) {
                                    res.json(buildResult("添加成功", null, 1));
                                }
                            })
                    }
                }
            });
    }).caught(function (err) {
        res.json(buildResult("添加失败：" + err.message, null, 0));
    })
}

exports.updateOrder = function (req, res) {
    var id = req.params.id;
    models.orders.update(req.body, { where: { id: id } })
        .then(function () {
            res.json(buildResult("更新成功", null, 1));
        }).caught(function (err) {
            res.jsong(buildResult("更新失败：" + err.message, null, 0));
        });
}

exports.deleteOrder = function (req, res) {
    var id = req.params.id;
    models.orders.update({ state: 4 }, { where: { id: id } })
        .then(function () {
            res.json(buildResult("删除成功", null, 1));
        }).caught(function (err) {
            res.json(buildResult("删除失败：" + err.message, null, 0));
        });
}