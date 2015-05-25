var webpack = require('webpack');

// var env = 'prod';
var env = 'dev';

module.exports = {
    entry: {
        app: env === 'dev' ? [
            'webpack-dev-server/client?http://localhost:8888',
            // Why only-dev-server instead of dev-server:
            // https://github.com/webpack/webpack/issues/418#issuecomment-54288041
            'webpack/hot/only-dev-server',
            './js/app'
        ] : [
            './js/app'
        ]
    },
    output: {
        path: __dirname,
        filename: "js/bundle.js",
        // Path you're going to use in HTML
        // publicPath: '/js'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [{
            test: /\.js?$/,
            loaders: ['react-hot', 'babel'],
            exclude: /node_modules/
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }, {
            test: /\.css$/,
            loader: "style!css"
        }]
    },
};