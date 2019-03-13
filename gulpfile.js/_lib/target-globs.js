const common = { src: 'src/common/*.js', dest: 'dist/common' };
const server = { src: 'src/server/**/*.js', dest: 'dist/server' };
const client = { src: 'src/client/**/*.js?x', dest: 'dist/client' };
const all = { src: [common.src, client.src, server.src], dest: 'dist' };

module.exports = {
  common,
  server,
  client,
  all,
};
