const { PROD, DEV } = require('./envs');

const packProdution = () => Promise.resolve();
const packDevelopment = () => Promise.resolve();

module.exports = {
  [PROD]: packProdution,
  [DEV]: packDevelopment,
};
