const server = { src: 'src/server/**/*.js', dest: 'dist/server' };
const client = { src: 'src/client/**/*.js?x', dest: 'dist/client' };
const all = { src: [client.src, server.src], dest: 'dist' };

module.exports = {
  server,
  client,
  all,
};
