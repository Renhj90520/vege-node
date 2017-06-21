var fs = require('fs');
var formidable = require('formidable');
var rands = require('../utils/rand');
var path = require('path');
var buildResult = require('../utils/resultutil');
var settings = require('../utils/settings');

var upload_dir = "public/upload";

exports.upload = function (req, res) {
    try {
        var form = formidable.IncomingForm();
        form.encoding = 'utf-8';
        form.uploadDir = upload_dir;
        form.keepExtensions = true;
        form.parse(req, function (err, fields, files) {
            if (err) {
                res.json(buildResult("上传失败：" + err.message, null, 0));
                return;
            }

            if (files.upload) {
                var file_name = files.upload.name;
                var type = path.extname(file_name);
                var clock = rands.getRand();
                var newPath = path.join(form.uploadDir, clock + type);

                var fileInfo = {};
                fileInfo.path = settings.server + newPath.replace('\\', '/');
                fs.renameSync(files.upload.path, newPath, function (err) { });
                res.json(buildResult("上传成功", fileInfo, 1));
            } else {
                res.json(buildResult("上传失败：upload undefined", null, 0));
            }
        })
    } catch (error) {
        res.json(buildResult("上传失败", null, 0));
    }
}