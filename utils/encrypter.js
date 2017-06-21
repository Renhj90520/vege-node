var crypto = require('crypto');

exports.md5Encrypt = function (pwd) {
    var md5 = crypto.createHash('md5');
    return md5.update(pwd).digest('hex');
}