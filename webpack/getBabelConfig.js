module.exports = (config) => ({
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: config,
        },
      },
    ],
  },
});
