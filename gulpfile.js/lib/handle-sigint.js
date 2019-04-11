module.exports = cb => {
  process.on('SIGINT', () => {
    cb();
  });
};
