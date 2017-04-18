const path = require('path');

module.exports = {
    contentBase: 'src/www',
    devtool: 'eval',
    hot: true,
    inline: true,
    host: '0.0.0.0',
    port: 3002,
    proxy: {
        '/service/*': {
            target: 'http://120.24.176.56:9010/',
            pathRewrite: {
                '^/service': '/'
            },
            secure: false,
            changeOrigin: true
        }
    },
    outputPath: path.resolve(__dirname, './build'),
};