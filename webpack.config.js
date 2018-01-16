const path = require('path');

module.exports = {
    entry: './js/ui.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    target: 'electron',
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, './js')
                ],
                loader: 'eslint-loader',
                exclude: /node_modules/
            },
        ]
    },
};

