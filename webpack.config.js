const path = require('path');
const { NoEmitOnErrorsPlugin, ProgressPlugin } = require('webpack');

module.exports = {
    devtool: 'source-map',

    entry: {
        main: './src/main.js'
    },
    
    output: {
        path: path.resolve(__dirname, 'dist/'),
        filename: '[name].bundle.js'
    },

    module: {
        rules: [
            { test: /\.js$/, loader: 'babel-loader' }
        ]
    },

    plugins: [
        new NoEmitOnErrorsPlugin(),
        new ProgressPlugin()
    ],

    node: {
        fs: 'empty',
        crypto: 'empty'
    }
};
