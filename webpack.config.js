const path = require('path');

module.exports = {
  entry: './js/src/ui.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'js/dist'),
  },
  target: 'electron',
  module: {
    loaders: [
      {
        test: /\.(s*)css$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
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

