global.hexo = hexo; // 全局
var sync = require('./sync');

var cmd_options = {
    desc: 'Hexo 七牛静态资源上传插件',
    usage: '<type>',
    'arguments': [
        {"name": 'sync | s', "desc": "上传静态资源到七牛空间"},
        {"name": 'sync2 | s2', "desc": "上传静态资源到七牛空间（包括有差异的文件）"}
    ]
};

hexo.extend.console.register('qn', '七牛静态资源上传插件', cmd_options, function (args, callback) {
    var action = args._[0];

    if (action && sync[action]) {
        sync[action]();
    } else {
        hexo.call('help', {_: ['qiniu']}, callback);
    }
});
