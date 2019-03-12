module.exports = ({ name, target, env }) =>
  `${name}${target === 'all' ? '' : `:${target}`}${env ? `:${env}` : ''}`;
