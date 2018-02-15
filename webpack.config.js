const path = require('path');

module.exports = {
  entry: './js/src/ui.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'js/dist'),
    publicPath: path.resolve(__dirname, './'),
  },
  target: 'electron',
  module: {
    loaders: [
      {
        test: /\.(s*)css$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader?name=/fonts/[name].[ext]',
      },
      /* {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, './js/src')
                ],
                loader: 'eslint-loader',
                exclude: /node_modules/
            }, */
    ],
  },
};

