module.exports = {
  entry: {
    server: './src/client',
    client: './src/server',
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
  },
};
