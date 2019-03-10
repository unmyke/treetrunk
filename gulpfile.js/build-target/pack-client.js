const invalidModeRejectedPromise = require('./invalid-mode-rejected-promise');

const packProdution = () => Promise.resolve();
const packDevelopment = () => Promise.resolve();

module.exports = (env) => {
  switch (env) {
    case 'production':
      return packProdution;

    case 'development':
      return packDevelopment;

    default:
      return invalidModeRejectedPromise(env);
  }
};
