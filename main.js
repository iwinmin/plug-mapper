/**
 - 处理环境变量
 - 读取配置文件
 - 运行主要处理逻辑
 */

if (global.plugMapper) {
    module.exports = global.plugMapper;
    return;
}

// 初始化应用
const ENV = process.env;
var opts = {
    conf_file: (ENV.CONF_FILE || __dirname + '/conf/main.js')
};

var app = global.plugMapper = module.exports = require('./src/app.js').new(opts);

// 启动程序
app.run();