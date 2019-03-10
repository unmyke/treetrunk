module.exports = (target) => {
  if (target === 'client') {
    return { src: 'src/client/**/*.js?x', dest: 'dist/client' };
  }

  return { src: 'src/server/**/*.js', dest: 'dist/server' };
};
