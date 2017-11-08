const path = require('path');
const webpack = require('webpack');

const port = process.env.PORT || '8080';

const config = {
    context: __dirname,
    entry: [
        'babel-polyfill',
        path.resolve(__dirname, './renderer.js'),
        `webpack-hot-middleware/client?path=http://localhost:${port}/__webpack_hmr`,
    ],
    target: 'electron-renderer',
    output: {
        filename: 'renderer.bundle.js',
        path: __dirname + '/bundle',
        publicPath: `http://localhost:${port}/bundle/`,
        libraryTarget: 'commonjs2'
    },
    module: {
        loaders: [
            { test: /\.js$/,
                loaders: ['babel-loader?presets[]=es2015,presets[]=react,presets[]=react-hmre','eslint-loader'],
                include: [
                    path.join(__dirname, 'src'),
                    path.join(__dirname, 'renderer.js')
                ],
                exclude: /node_modules/
            }, {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
            }, {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!sass-loader'
            }, {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ]
};

module.exports = config;