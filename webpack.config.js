var path = require('path');
var webpack = require('webpack');

module.exports = {
    context: path.join(__dirname),
    entry: './source/index.js',
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname),
        filename: 'react-vr-player.js',
        libraryTarget: 'umd',
        libary:'react-vr-player'
    },
    externals: {
       'react': true,
       'react/addons': true
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style!css' },
            { test: /\.jsx$/, loaders: ['jsx', 'babel'], exclude: /node_modules/ },
            { test: /\.js$/, loaders: ['babel'], exclude: /node_modules/ },
            { test: /\.glsl$/, loaders: ['webpack-glsl'], exclude: /(node_modules)/ }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
            __DEVELOPMENT__: false
        })
    ]
};
