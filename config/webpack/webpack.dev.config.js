var webpack = require('webpack'),
    path = require('path'),
    autoprefixer = require('autoprefixer'),
    precss = require('precss'),
    node_modules_dir = path.join(__dirname, 'node_modules');
//html模板生成
var htmlWebpackPlugin = require('html-webpack-plugin');

//alias
const Alias = require('./alias');


var entry = {   
    index: ['webpack/hot/only-dev-server', './src/main.js']
};

var output = {
    path: path.resolve(__dirname, './build'),
    filename: '[name].js'
};

var config = {
    entry: entry,
    output: output,
    module: {
        noParse: [],
        loaders: [{
            test: /\.vue$/,
            loader: 'vue-loader'
        }, {
            test: /\.js$/,
            exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
            loader: 'babel-loader'
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader!postcss-loader'
        }, {
            test: /\.scss$/,
            loader: 'style-loader!css-loader!sass-loader'
        }, {
            test: /\.less$/,
            loader: 'style-loader!css-loader!less-loader'
        }, {
            test: /\.(gif|jpg|jpeg|png|woff|svg|eot|ttf)\??.*$/,
            loader: 'url-loader?limit=10000&name=./images/[name].[ext]'
        }]
    },
    resolve: {
        root: [process.cwd() + '/src'],
        alias: {},
        extensions: ['', '.js', '.vue', '.coffee', '.html', '.css', '.scss']
    },
    devServer: require('./devServer'),
    postcss: function () {
        return [autoprefixer, precss];
    },
    plugins: [
        new webpack.DllReferencePlugin({
            context: path.resolve(__dirname, '../../'), // 指定一个路径作为上下文环境，需要与DllPlugin的context参数保持一致，建议统一设置为项目根目录
            manifest: require('../../manifest.json'),
            name: 'dll'
        }),
        new htmlWebpackPlugin({
            title: '豌豆医学影像管理平台',
            template: './src/template/index.html',
            filename: 'index.html',
            chunks: ['index']
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
}


Alias(config);

module.exports = config;