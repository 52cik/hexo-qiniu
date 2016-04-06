var fs = require('fs');
var path = require('path');
var qiniu = require('node-qiniu');
var minimatch = require('minimatch');
var getEtag = require('./qetag');


var cfg = hexo.config.qiniu || {}; // 配置
var static_dir = cfg.static_dir || 'static'; // 静态资源目录
var ignoring_log = !!cfg.ignoring_log; // 忽略的文件日志
var ignoring_files = cfg.ignoring_files || []; // 忽略的文件

var log = hexo.log; // 控制台输出

// 配置七牛key
qiniu.config({
    access_key: cfg.access_key,
    secret_key: cfg.secret_key
});

// 获得空间对象
var bucket = qiniu.bucket(cfg.bucket);


var update_exist = false; // 检测已上传的文件


/**
 * 遍历目录进行上传
 *
 * @param  {string} dir 待上传的目录
 */
function sync(dir) {
    if (!dir) {
        log.i('开始上传到七牛...');
        dir = '.';
    }

    var files = fs.readdirSync(path.join(static_dir, dir));

    files.forEach(function (file) {
        var fname = path.join(static_dir, dir, file);
        var stat = fs.lstatSync(fname);

        if (stat.isDirectory() == true) {
            sync(path.join(dir, file));
        } else {
            var name = fname.replace(static_dir, '').replace(/\\/g, '/').replace(/^\//g, '');

            if (!isIgnoringFiles(name)) {
                checkUpload(fname, name);
            } else {
                ignoring_log && log.i('忽略文件: ' + name);
            }
        }
    });
}


/**
 * 遍历目录进行上传(检测文件更新)
 */
function sync2() {
    update_exist = true;
    sync();
}


/**
 * 上传文件到对应 bucket
 *
 * @param  {string} file 本地文件路径
 * @param  {string} name 远程bucket文件路径
 */
function uploadFile(file, name) {
    bucket.putFile(name, file, function (err, reply) {
        if (err) {
            log.w('上传错误: ' + err);
            return false;
        }

        log.i('上传完成: ' + reply.key);
    });
}


/**
 * 上传前预先检查
 *
 * @param  {string} file 本地文件路径
 * @param  {string} name 远程bucket文件路径
 */
function checkUpload(file, name) {
    var res = bucket.key(name);

    res.stat(function (err, stat) {
        if (err) {
            log.e('获取文件状态错误: ' + name + '\n' + err);
            return;
        }

        getEtag(file, function (hash) {
            if (stat.hash) { // 先判断七牛是否已存在文件
                if (!update_exist) { // 已存在的不上传
                    return;
                }

                if (stat.hash != hash) {
                    res.remove(function (err) {
                        if (err) {
                            log.e('删除远程文件错误: ' + name + '\n' + err);
                            return;
                        }

                        log.i('正在更新: ' + file);
                        uploadFile(file, name);
                    });
                }
            } else {
                log.i('正在上传: ' + file);
                uploadFile(file, name);
            }
        });
    });
}


/**
 * 忽略指定文件
 *
 * @param  {string}  path 文件路径
 * @return {boolean}
 */
function isIgnoringFiles(path) {
    if (!ignoring_files.length) return false;

    for (var i = 0, l = ignoring_files.length; i < l; i++) {
        if (minimatch(path, ignoring_files[i])) return true;
    }

    return false;
}


module.exports = {
    sync: sync,
    s: sync,

    sync2: sync2,
    s2: sync2
};
