const config = { src: './config/*.js', dest: 'dist/config' };
const server = { src: 'src/server/**/*.js', dest: 'dist/server' };
const client = { src: 'src/client/**/*.js?x', dest: 'dist/client' };
const all = { src: [config.src, client.src, server.src], dest: 'dist' };

module.exports = {
  config,
  server,
  client,
  all,
};
