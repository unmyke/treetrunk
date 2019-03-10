module.exports = (env) =>
  Promise.reject(new Error(`${env}-mode not supported`));
