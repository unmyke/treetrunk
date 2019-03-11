const packProdution = () => Promise.resolve();
const packDevelopment = () => Promise.resolve();

module.exports = {
  production: packProdution,
  development: packDevelopment,
};
