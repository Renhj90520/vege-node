var settings = require('../utils/settings');
var jwt = require('../utils/jwt');
var models = require('../models');
var md5 = require('../utils/encrypter');
sequelize = models.sequelize;
var moment = require('moment');
var buildResult = require('../utils/resultutil');
var OAuth = require('wechat-oauth');
var client = new OAuth(settings.appid, settings.appsecret);

exports.redirect = function (req, res) {
    var url = client.getAuthorizeURL(settings.server + 'authorization/getuserinfo', '123', 'snsapi_base')
    res.redirect(url);
}

exports.getUserInfo = function (req, res) {
    var code = req.query.code;
    client.getAccessToken(code, function (err, result) {
        var openid = result.data['openid'];
        var accesstoken = result.data['access_token'];

        models.users.findOne({ where: { OpenId: openid } })
            .then(function (user) {
                if (user) {
                    res.redirect(settings.server + 'login/' + openid);
                } else {
                    client.getUser(openid, function (err, result) {
                        var u = { OpenId: openid, Name: result.nickname, Sex: result.sex, City: result.city, Province: result.province };
                        models.users.create(u)
                            .then(function () {
                                res.redirect(settings.server + 'login/' + openid);
                            })
                    });
                }
            })
    })
}

exports.gettoken = function (req, res) {
    var openid = req.body.openid;
    models.users.findOne({ where: { OpenId: openid } })
        .then(function (user) {
            var payload = {
                iss: settings.server,
                aud: settings.server,
                claims: { openid: openid }
            };
            var token = jwt.encode(payload, settings.tokenkey);
            res.json(buildResult("登录成功", token, 1));
        }).caught(function (err) {
            res.json(buildResult("用户不存在", null, 0));
        })
}

exports.signin = function (req, res) {
    var username = req.body.UserName;
    var password = req.body.Password;
    var pwdEncrypted = md5.md5Encrypt(password);

    models.users.findOne({ where: { UserName: username, Password: pwdEncrypted } })
        .then(function (user) {
            if (user) {
                var payload = {
                    iss: settings.server,
                    aud: settings.server,
                    exp: moment().utc(true).add(20, 'minutes').unix(),
                    claims: { username: username }
                };
                var token = jwt.encode(payload, settings.tokenkey);
                res.json(buildResult("登录成功", token, 1));
            } else {
                res.json(buildResult("登录失败：用户名或密码错误", null, 0));
            }
        }).caught(function (err) {
            res.json(buildResult("登录失败：" + err.message, null, 0));
        });
}
