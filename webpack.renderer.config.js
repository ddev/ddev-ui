const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/env', '@babel/react'],
        },
      },
    ],
  },
  resolve: {
    alias: {
      main: path.resolve(__dirname, 'src', 'main'),
      components: path.resolve(__dirname, 'src', 'renderer', 'components'),
      renderer: path.resolve(__dirname, 'src', 'renderer'),
      resources: path.resolve(__dirname, 'src', 'resources'),
      app: path.join(__dirname, 'src'),
    },
    extensions: ['.js', '.jsx'],
    // modules: [path.join(__dirname, 'src'), 'node_modules'],
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
  },
};
