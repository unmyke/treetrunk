module.exports = ({ name, target, env }) =>
  `${name}${!target || target === 'all' ? '' : `:${target}`}${
    env ? `:${env}` : ''
  }`;
