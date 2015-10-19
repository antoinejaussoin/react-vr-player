var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        app: './source/index.js',
        react: ['react']
    },
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname+'/build'),
        publicPath: '/assets/',
        filename: 'vr-player-min.js'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style!css' },
            { test: /\.jsx$/, loaders: ['jsx', 'babel'], exclude: /node_modules/ },
            { test: /\.js$/, loaders: ['babel'], exclude: /node_modules/ },
            { test: /\.glsl$/, loaders: ['webpack-glsl'], exclude: /(node_modules)/ }
        ]
    },
    externals: {

    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('react', 'react.js'),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
          compress: {
              warnings: false
            }
        })
    ]
};
